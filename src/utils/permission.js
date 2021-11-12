import { Alert, Platform } from "react-native";
import { translate as t } from "~/Helper/I18n";
// import Permissions, { PERMISSIONS } from 'react-native-permissions';

const Permissions = () => {};
const PERMISSIONS = {};

export const permissionType = {
  photo: "photo",
  camera: "camera",
  speech: "speech",
  location: "location",
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
    description: t("permission_request_desc_location_system"),
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
        platformType = [
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          PERMISSIONS.IOS.LOCATION_ALWAYS,
        ];
      }
    } else if (Platform.OS === "android") {
      if (type === permissionType.camera) {
        platformType = PERMISSIONS.ANDROID.CAMERA;
      } else if (type === permissionType.speech) {
        platformType = PERMISSIONS.ANDROID.RECORD_AUDIO;
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
