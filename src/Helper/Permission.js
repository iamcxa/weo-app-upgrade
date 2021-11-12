import { Alert, Platform } from "react-native";
import Permissions, { PERMISSIONS } from "react-native-permissions";

import { AppStore } from "~/Store";
import { AppPermissionActions, UserActions } from "~/Store/Actions";

// import { Dialog, Fcm, t } from '~/Helper';
import Dialog from "./Dialog";
import Fcm from "./Fcm";
import { translate as t } from "./I18n";

export const requestGeolocationPermission = () =>
  AppStore.dispatch(
    AppPermissionActions.requestPermission({
      permission: permissionType.GEOLOCATION_LOW,
      // requestTitle: t('permission_request_title'),
      // requestDescription: t('permission_request_desc_location'),
      requestFromSystemTitle: t("permission_request_title"),
      requestFromSystemDescription: t(
        "permission_request_desc_location_system"
      ),
      shouldForceGetPermission: false,
    })
  );

export const requestBodySensorPermission = () =>
  AppStore.dispatch(
    AppPermissionActions.requestPermission({
      permission: permissionType.BODY_SENSORS,
      // requestTitle: t('permission_request_title'),
      // requestDescription: t('permission_request_desc_body_sensor_system'),
      requestFromSystemTitle: t("permission_request_title"),
      requestFromSystemDescription: t("permission_request_desc_body_sensor"),
      shouldForceGetPermission: true,
    })
  );

export const requestMicrophonePermission = () =>
  AppStore.dispatch(
    AppPermissionActions.requestPermission({
      permission: permissionType.MICROPHONE,
      // requestTitle: t('permission_request_title'),
      // requestDescription: t('permission_request_desc_speech'),
      requestFromSystemTitle: t("permission_request_title"),
      requestFromSystemDescription: t("permission_request_desc_speech"),
      shouldForceGetPermission: false,
      onSuccess: () => Platform.OS === "ios" && requestSpeechPermission(),
    })
  );

export const requestSpeechPermission = () =>
  AppStore.dispatch(
    AppPermissionActions.requestPermission({
      permission: permissionType.SPEECH_RECOGNITION,
      // requestTitle: t('permission_request_title'),
      // requestDescription: t('permission_request_desc_speech'),
      requestFromSystemTitle: t("permission_request_title"),
      requestFromSystemDescription: t("permission_request_desc_speech"),
      shouldForceGetPermission: false,
    })
  );

export const requestCameraPermission = () =>
  AppStore.dispatch(
    AppPermissionActions.requestPermission({
      permission: permissionType.CAMERA,
      // requestTitle: t('permission_request_title'),
      // requestDescription: t('permission_request_desc_camera'),
      requestFromSystemTitle: t("permission_request_title"),
      requestFromSystemDescription: t("permission_request_camera_speech"),
      shouldForceGetPermission: false,
    })
  );

export const requestPhotoPermission = () =>
  AppStore.dispatch(
    AppPermissionActions.requestPermission({
      permission: permissionType.PHOTO,
      // requestTitle: t('permission_request_title'),
      // requestDescription: t('permission_request_desc_photo'),
      requestFromSystemTitle: t("permission_request_title"),
      requestFromSystemDescription: t("permission_request_photo_speech"),
      shouldForceGetPermission: false,
    })
  );

export const requestNotificationPermission = async () => {
  const fcmToken = await Fcm.getToken();
  console.log("requestFcmPermissionAlert fcmToken=>", fcmToken);
  if (fcmToken) {
    AppStore.dispatch(UserActions.updateUserStore({ fcmToken }));
  }
}; // Dialog.requestFcmPermissionAlert;

export const permissionType = {
  //
  photo: "photo",
  camera: "camera",
  speech: "speech",
  location: "location",
  //

  CAMERA: Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  }),
  PHOTO: Platform.select({
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.CAMERA,
  }),
  GEOLOCATION_LOW: Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  }),
  GEOLOCATION_HIGH: Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  }),
  BODY_SENSORS: Platform.select({
    ios: PERMISSIONS.IOS.MOTION,
    android: PERMISSIONS.ANDROID.BODY_SENSORS,
  }),
  MICROPHONE: Platform.select({
    ios: PERMISSIONS.IOS.MICROPHONE,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
  }),
  SPEECH_RECOGNITION: Platform.select({
    ios: PERMISSIONS.IOS.SPEECH_RECOGNITION,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
  }),
  NOTIFICATION: Platform.select({
    ios: PERMISSIONS.IOS.MICROPHONE,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
  }),
};

const permissionInfo = () => ({
  photo: {
    title: t("permission_request_title"),
    description: t("permission_request_desc_photo"),
  },
  camera: {
    title: t("permission_request_title"),
    description: t("permission_request_desc_camera"),
  },
  speech: {
    title: t("permission_request_title"),
    description: t("permission_request_desc_speech"),
  },
  location: {
    title: t("permission_request_title"),
    description: t("permission_request_desc_location"),
  },
});

export const checkAndRequestPermission = async (
  type,
  requestPermissionWhenCheck = true
) => {
  let platformType = "";
  try {
    if (Platform.OS === "ios") {
      if (type === permissionType.camera) {
        platformType = PERMISSIONS.IOS.CAMERA;
      } else if (type === permissionType.photo) {
        platformType = PERMISSIONS.IOS.PHOTO_LIBRARY;
      } else if (type === permissionType.speech) {
        platformType = PERMISSIONS.IOS.MICROPHONE;
      } else if (type === permissionType.location) {
        platformType = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
        //   [
        //   PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        //   PERMISSIONS.IOS.LOCATION_ALWAYS,
        // ];
      }
    } else if (Platform.OS === "android") {
      if (type === permissionType.camera) {
        platformType = PERMISSIONS.ANDROID.CAMERA;
      } else if (type === permissionType.speech) {
        platformType = PERMISSIONS.ANDROID.RECORD_AUDIO;
      } else if (type === permissionType.location) {
        platformType = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      }
    }
    if (platformType) {
      let permissionStatus;
      if (typeof platformType === "object") {
        const checkPermission = await Promise.all(
          platformType.map((item) => Permissions.check(item))
        );
        console.log("checkPermission=>", checkPermission);
      } else {
        permissionStatus = await Permissions.check(platformType);
      }
      console.log("permissionStatus=>", permissionStatus);
      // 'granted' / 'blocked' / 'denied' / 'unavailable'
      if (permissionStatus === "granted") {
        return true;
      }
      if (Platform.OS === "ios" && permissionStatus === "blocked") {
        // iOS only have once chance to show the permission dialog
        // if user had denied permission, you can only request him setting manually enable from setting
        Alert.alert(
          permissionInfo()[type].title,
          permissionInfo()[type].description,
          [
            {
              text: t("__cancel"),
              onPress: () => {},
              style: "cancel",
            },
            {
              text: t("__open_system_setting"),
              onPress: Permissions.openSettings,
            },
          ]
        );
      } else if (Platform.OS === "android" && permissionStatus === "blocked") {
        // iOS only have once chance to show the permission dialog
        // if user had denied permission, you can only request him setting manually enable from setting
        Alert.alert(
          permissionInfo()[type].title,
          permissionInfo()[type].description,
          [
            {
              text: t("__cancel"),
              onPress: () => {},
              style: "cancel",
            },
            {
              text: t("__open_system_setting"),
              onPress: Permissions.openSettings,
            },
          ]
        );
      } else {
        if (requestPermissionWhenCheck) {
          // if have no permission, request it
          const res = await Permissions.request(platformType);
          if (res === "granted") {
            return true;
          }
        }
        return false;
      }
      return false;
    }
    return true;
  } catch (error) {
    console.log("check and request permission error", error);
  }
};

export default {
  ...permissionType,
  GRANTED: "granted",
  checkAndRequestPermission,
  requestSpeechPermission,
  requestBodySensorPermission,
  requestGeolocationPermission,
  requestNotificationPermission,
  requestMicrophonePermission,
  requestCameraPermission,
  requestPhotoPermission,
  // PERMISSION_TYPE_GEOLOCATION,
  // PERMISSION_TYPE_NOTIFICATION,
  // PERMISSION_TYPE_PHOTO_LIBRARY,
  // PERMISSION_TYPE_CAMERA,
};
