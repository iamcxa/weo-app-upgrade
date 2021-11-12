import { Platform } from "react-native";
import { Actions } from "react-native-router-flux";
import { call, put, select } from "redux-saga/effects";

import { Handler, User } from "~/Api";
import { Dialog, Fcm, Logger, UserHelper } from "~/Helper";
import { AppStateActions, CircleActions, UserActions } from "~/Store/Actions";

const helpers = require("~/Helper");

const TAG = "@UserSaga";

export function* fetchPostSignUp({
  nickname = "",
  avatarKey = "",
  identifier = "",
  deviceInfo = {},
} = {}) {
  yield put(AppStateActions["app/onLoading"](true));
  try {
    const apiToken = yield select((state) => state.user.apiToken);
    const fcmToken = yield select((state) => state.user.fcmToken);

    const { data: res } = yield call(
      Handler.post({
        Authorization: apiToken,
        data: {
          nickname,
          avatarKey,
          identifier,
          deviceInfo: {
            token: deviceInfo.token || fcmToken,
            // deviceInfo.deviceToken || fcmToken || false,
            platform: deviceInfo.platform || Platform.OS.toUpperCase, // deviceInfo.platform || Platform.OS === 'ios' ? 'IOS_FCM' : 'ANDROID',
          },
        },
      }),
      User.signUp()
    );
    console.log("fetchPostSignUp res=>", res);

    if (res.success) {
      yield put(UserActions.updateUserProfile(res.data));
      yield call(requestAnimationFrame, Actions.HomeScreen);
    } else {
      // yield call(requestAnimationFrame, Actions.Signup);
    }
    return res;
  } catch (error) {
    Logger.error(TAG, error);
    return error;
  } finally {
    yield put(AppStateActions["app/onLoading"](false));
  }
}

export function* fetchPostLogout() {
  yield put(AppStateActions["app/onLoading"](true));
  try {
    const apiToken = yield select((state) => state.user.apiToken);
    const { data: res } = yield call(
      Handler.post({
        Authorization: apiToken,
      }),
      User.logout()
    );
    console.log("fetchPostLogout res=>", res);

    if (res.success) {
      yield put(UserActions.cleanUser());
      yield call(requestAnimationFrame, [
        Actions,
        Actions.HomeScreen,
        {
          panHandlers: null,
          type: "replace",
        },
      ]);
    } else {
    }
    return res;
  } catch (error) {
    Logger.error(TAG, error);
    return error;
  } finally {
    yield put(AppStateActions["app/onLoading"](false));
  }
}

export function* fetchPostAutoSignUp({
  forceRequest = false,
  onSuccess = null,
} = {}) {
  const apiToken = yield select((state) => state.user.apiToken);
  const fcmToken = yield call(Fcm.getToken);
  try {
    if (!apiToken || forceRequest) {
      const avatarId = helpers.UserHelper.getRandomSeed(12);
      const nickName = helpers.UserHelper.getRandomNickName();
      const data = {
        avatarKey: `Avatar${avatarId}`,
        nickname: nickName,
        identifier: `${new Date().getTime()}${Math.floor(
          Math.random() * 100 + 1
        )}`,
        deviceInfo: {
          platform: Platform.OS.toUpperCase(),
          token: fcmToken,
        },
      };

      const res = yield call(fetchPostSignUp, data);
      if (res.success) {
        yield put(CircleActions.fetchGetStayCircles());
        if (typeof onSuccess === "function") {
          onSuccess(res.success);
        }
      }
      return res;
    }
    return null;
  } catch (error) {
    Logger.error(TAG, error);
    return error;
  }
}
