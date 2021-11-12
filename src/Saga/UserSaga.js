import { Platform } from "react-native";
import { Actions } from "react-native-router-flux";
import { call, put, select } from "redux-saga/effects";

import { Handler, User } from "~/Api";
import { Dialog, Fcm, Logger, UserHelper } from "~/Helper";
import { AppStateActions, CircleActions, UserActions } from "~/Store/Actions";

const helpers = require("~/Helper");

const TAG = "@UserSaga";

export function* fetchPutUserProfile({ nickname = "", avatarKey = "" }) {
  yield put(AppStateActions["app/onLoading"](true));
  try {
    const apiToken = yield select((state) => state.user.apiToken);
    const fcmToken = yield select((state) => state.user.fcmToken);
    const { data: res } = yield call(
      Handler.put({
        Authorization: apiToken,
        data: {
          nickname,
          avatarKey,
          deviceInfo: {
            deviceToken: fcmToken || false,
            platform: Platform.OS === "ios" ? "IOS_FCM" : "ANDROID",
          },
        },
      }),
      User.updateProfile()
    );
    console.log("fetchPutUserProfile res=>", res);

    if (res.success) {
      yield put(UserActions.updateUserProfile(res.data));
      yield call(requestAnimationFrame, Actions.pop);
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

export function* fetchPutUserNotifyConfig({
  hasCircleNotify,
  hasTopicNotify,
  hasPostNotify,
  hasReplyNotify,
}) {
  yield put(AppStateActions["app/onLoading"](true, null, { hide: true }));
  try {
    const lastConfig = yield select((state) => state.user.config);
    yield put(
      UserActions.updateUserProfile({
        hasCircleNotify,
        hasTopicNotify,
        hasPostNotify,
        hasReplyNotify,
      })
    );
    const apiToken = yield select((state) => state.user.apiToken);
    const fcmToken = yield select((state) => state.user.fcmToken);
    const { data: res } = yield call(
      Handler.put({
        Authorization: apiToken,
        data: {
          hasCircleNotify,
          hasTopicNotify,
          hasPostNotify,
          hasReplyNotify,
          deviceInfo: {
            deviceToken: fcmToken || false,
            platform: Platform.OS === "ios" ? "IOS_FCM" : "ANDROID",
          },
        },
      }),
      User.updateConfig()
    );
    console.log("fetchPutUserNotifyConfig res=>", res);
    if (res.success) {
      yield call(Dialog.configUpdatedSuccessAlert);
    } else {
      yield put(UserActions.updateUserProfile(lastConfig));
      yield call(Dialog.configUpdatedFailureAlert);
    }
    return res;
  } catch (error) {
    Logger.error(TAG, error);
    return error;
  } finally {
    yield put(AppStateActions["app/onLoading"](false));
  }
}
