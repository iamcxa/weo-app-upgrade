import { put, call, select } from 'redux-saga/effects';
import { AppConfigActions, AppPermissionActions, AppStateActions } from '~/Store';
import Config from '~/Config';
import { Permission, Dialog } from '~/Helper';
import * as StartupSaga from './StartupSaga';

const { CIRCLE_TYPE } = Config;

export function* pushActionWatcher({ routeName }) {
  switch (routeName) {
    case 'SplashScreen': {
      yield call(StartupSaga.startup);
      break;
    }
    default: {
      break;
    }
  }
}
