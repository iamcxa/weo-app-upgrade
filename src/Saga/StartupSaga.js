import { put, call, take, delay, select } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import { Platform } from 'react-native';

import { CircleActions, AppStateActions, AppConfigActions, AppPermissionActions } from '~/Store';
import { AppStateTypes } from '~/Stores/AppState/Actions';
import * as WeoConfigSaga from '~/Sagas/WeoConfigSaga';
import { Logger, Permission, Dialog } from '~/Helper';

/**
 * The startup saga is the place to define behavior to execute when the application starts.
 */
const TAG = '@StartupSaga';

export function* startup() {
  yield put(AppStateActions.onLoading(true));
  try {
    // 1. Check permission status when app startups
    yield put(
      AppPermissionActions.checkPermissions([
        Platform.OS === 'ios' && Permission.SPEECH_RECOGNITION,
        Permission.MICROPHONE,
        Permission.GEOLOCATION_LOW,
        Permission.BODY_SENSORS,
        // Permission.NOTIFICATION,
      ]),
    );

    // 2. wait
    yield delay(1000);

    // 3. check api toke
    const apiToken = yield select((state) => state.user.apiToken);

    if (!apiToken) {
      return yield call(requestAnimationFrame, Actions.PermissionScreen);
    }

    // 4. Get newest app version
    const isCompatible = yield call(WeoConfigSaga.fetchGetWeoVersion);
    if (isCompatible) {
      // 1. Get app config
      yield put(AppConfigActions.fetchGetWeoConfig());

      // 2. Get current circle
      yield put(CircleActions.fetchGetStayCircles());

      // 3. reset circle data
      yield call(requestAnimationFrame, Actions.HomeScreen);
      // }
    } else {
      yield delay(1000);
      yield call(Dialog.requestInstallNewestVersionAppAlert);

      while (true) {
        const { currentState } = yield take(AppStateTypes.ON_STATE_CHANGE);
        if (currentState === 'active') {
          yield call(Dialog.requestInstallNewestVersionAppAlert);
        }
      }
    }
  } catch (error) {
    Logger.error(TAG, error);
  } finally {
    yield put(AppStateActions.onLoading(false));
  }
}
