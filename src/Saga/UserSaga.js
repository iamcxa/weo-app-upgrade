import { put, call, select } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import { Platform } from 'react-native';

import { AppStateActions, UserActions, CircleActions } from 'App/Stores';
import { Handler, User } from 'App/Apis';
import { Logger, Dialog, User as UserHelper, Content as ContentHelper } from 'App/Helpers';
import { translate as t } from 'App/Helpers/I18n';

const TAG = '@UserSaga';

export function* fetchPostSignUp({
  nickname = '',
  avatarKey = '',
  identifier = '',
  deviceInfo = {},
}) {
  yield put(AppStateActions.onLoading(true));
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
            deviceToken: deviceInfo.deviceToken || fcmToken || false,
            platform: deviceInfo.platform || Platform.OS === 'ios' ? 'IOS_FCM' : 'ANDROID',
          },
        },
      }),
      User.signUp(),
    );
    console.log('fetchPostSignUp res=>', res);

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
    yield put(AppStateActions.onLoading(false));
  }
}

export function* fetchPutUserProfile({ nickname = '', avatarKey = '' }) {
  yield put(AppStateActions.onLoading(true));
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
            platform: Platform.OS === 'ios' ? 'IOS_FCM' : 'ANDROID',
          },
        },
      }),
      User.updateProfile(),
    );
    console.log('fetchPutUserProfile res=>', res);

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
    yield put(AppStateActions.onLoading(false));
  }
}

export function* fetchPutUserNotifyConfig({
  hasCircleNotify,
  hasTopicNotify,
  hasPostNotify,
  hasReplyNotify,
}) {
  yield put(AppStateActions.onLoading(true, null, { hide: true }));
  try {
    const lastConfig = yield select((state) => state.user.config);
    yield put(
      UserActions.updateUserProfile({
        hasCircleNotify,
        hasTopicNotify,
        hasPostNotify,
        hasReplyNotify,
      }),
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
            platform: Platform.OS === 'ios' ? 'IOS_FCM' : 'ANDROID',
          },
        },
      }),
      User.updateConfig(),
    );
    console.log('fetchPutUserNotifyConfig res=>', res);
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
    yield put(AppStateActions.onLoading(false));
  }
}

export function* fetchPostLogout() {
  yield put(AppStateActions.onLoading(true));
  try {
    const apiToken = yield select((state) => state.user.apiToken);
    const { data: res } = yield call(
      Handler.post({
        Authorization: apiToken,
      }),
      User.logout(),
    );
    console.log('fetchPostLogout res=>', res);

    if (res.success) {
      yield put(UserActions.cleanUser());
      yield call(requestAnimationFrame, [
        Actions,
        Actions.HomeScreen,
        {
          panHandlers: null,
          type: 'replace',
        },
      ]);
    } else {
    }
    return res;
  } catch (error) {
    Logger.error(TAG, error);
    return error;
  } finally {
    yield put(AppStateActions.onLoading(false));
  }
}

export function* fetchPostAutoSignUp({ fcmToken, onSuccess }) {
  try {
    if (!fcmToken) {
      fcmToken = yield select((state) => state.user.fcmToken);
    }

    const avatarId = UserHelper.getRandomSeed(12);
    const nickName = UserHelper.getRandomNickName();
    const data = {
      avatarKey: `Avatar${avatarId}`,
      nickname: nickName,
      identifier: `${new Date().getTime()}${Math.floor(Math.random() * 100 + 1)}`,
      deviceInfo: {
        deviceToken: fcmToken,
      },
    };

    const res = yield call(fetchPostSignUp, data);
    if (res.success) {
      yield put(CircleActions.fetchGetStayCircles());
      if (typeof onSuccess === 'function') {
        onSuccess(res.success);
      }
    }
    return res;
  } catch (error) {
    Logger.error(TAG, error);
    return error;
  }
}
