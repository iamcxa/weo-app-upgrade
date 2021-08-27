import { put, call, select } from 'redux-saga/effects';
import { AppConfigActions, AppPermissionActions, AppStateActions } from '~/Stores';
import Config from '~/Config';
import { Permission, Dialog } from '~/Helpers';
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
