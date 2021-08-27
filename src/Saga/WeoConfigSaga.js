import { put, call, select } from 'redux-saga/effects';

import { AppStateActions, AppConfigActions } from 'App/Stores';
import { Handler, Config } from 'App/Apis';
import { Logger } from 'App/Helpers';

const TAG = '@WeoConfigSaga';

export function* fetchGetWeoVersion() {
  try {
    const apiToken = yield select((state) => state.user.apiToken);
    const { data: res } = yield call(
      Handler.get({
        Authorization: apiToken,
      }),
      Config.getWeoVersion(),
    );
    if (res.success) {
      yield put(
        AppConfigActions.updateAppConfigStore({
          weoMinimalVersion: res.data.minimalVersion,
          weoCurrentVersion: res.data.currentVersion,
        }),
      );
      const { buildVersion } = yield select((state) => state.appState.currentVersion);

      return parseInt(buildVersion, 10) >= res.data.minimalVersion;
    }
    return false;
  } catch (error) {
    Logger.error(TAG, error);
    return true;
  }
}

export function* fetchGetWeoConfig() {
  yield put(AppStateActions.onLoading(true, null, { hide: true }));
  const isInternetReachable = yield select(
    (state) => state.appState.currentNetworkInfo.isInternetReachable,
  );
  if (isInternetReachable) {
    try {
      const apiToken = yield select((state) => state.user.apiToken);
      const { data: res } = yield call(
        Handler.get({
          Authorization: apiToken,
        }),
        Config.getBlockWords(),
      );
      if (res.success) {
        yield put(
          AppConfigActions.updateAppConfigStore({
            weoBlockWords: res.data.items,
          }),
        );
      }
    } catch (error) {
      Logger.error(TAG, error);
    } finally {
      yield put(AppStateActions.onLoading(false));
    }
  }
}
