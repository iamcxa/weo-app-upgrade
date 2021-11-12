import { ReactNativeAlert } from "@udea-io/axios-wrapper";
import { Alert } from "react-native";

import { translate as t } from "~/Helper/I18n";

// import { AppStateActions, AppStore } from '../../../weo-app/@App/Stores';

export const showServiceUnavailableAlert = (response, callback) =>
  ReactNativeAlert
    .ServiceUnavailableAlert
    //   {
    //   btnOk: t('api.button.ok', null),
    //   btnMore: t('api.button.more'),
    //   title: t('api.unavailable.title'),
    //   desc: t('api.unavailable.desc'),
    // }
    ()(response, callback);

export const showApiExceptionAlert = (response, callback) =>
  ReactNativeAlert
    .ApiExceptionAlert
    // {
    // btnOk: t('api.button.ok', null) || null,
    // btnMore: t('api.button.more'),
    // title: t('api.unavailable.title'),
    // desc: t('api.unavailable.des'),
    // }
    ()(response, callback);

//

export const leaveCircleAlert = ({
  onYesPress = () => {},
  onNoPress = () => {},
  oldCircleName,
  newCircleName,
}) =>
  // throttling(() => {
  Alert.alert(
    t("__alert_leave_circle"),
    t("__alert_leave_circle_content", { oldCircleName, newCircleName }),
    [
      {
        style: "cancel",
        text: t("__alert_leave_circle_no"),
        onPress: async () => {
          // AppStore.dispatch(AppStateActions.onSystemAlertShow(false));
          await onNoPress();
        },
      },
      {
        text: t("__alert_leave_circle_yes"),
        onPress: async () => {
          // AppStore.dispatch(AppStateActions.onSystemAlertShow(false));
          await onYesPress();
        },
      },
    ],
    { cancelable: false }
  );

export default {
  showServiceUnavailableAlert,
  showApiExceptionAlert,

  //

  //
  // requestInstallNewestVersionAppAlert,
  // requestAndroidExitAppAlert,
  // createContentIntervalTooShortTooAlert,
  // // requestLocationPermissionFromSystemAlert,
  // requestSpeechPermissionSystemAlert,
  // requestFcmPermissionFromSystemAlert,
  // requestFcmPermissionAlert,
  // containBlockedWordAlert,
  // choseHomeCircleAlert,
  leaveCircleAlert,
  // internetNotReachableAlert,
  // configUpdatedSuccessAlert,
  // configUpdatedFailureAlert,
  // requireEnableLocationServiceAlert,
  // requireEnableWifiAlert,
  // requireEnableGPSAlert,
  // wifiDisabledAlert,
  // noCircleAlert,
  // requestPermissionAlert,
};
