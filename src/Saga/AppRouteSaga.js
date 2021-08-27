import { put, call, select } from "redux-saga/effects";
import {
  AppConfigActions,
  AppPermissionActions,
  AppStateActions,
} from "App/Stores";
import Config from "App/Config";
import { Permission, Dialog } from "App/Helpers";
import * as StartupSaga from "./StartupSaga";

const { CIRCLE_TYPE } = Config;

export function* pushActionWatcher({ routeName }) {
  switch (routeName) {
    case "SplashScreen": {
      yield call(StartupSaga.startup);
      break;
    }
    default: {
      break;
    }
  }
}
