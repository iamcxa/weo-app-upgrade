import messaging from "@react-native-firebase/messaging";
// import UUID from 'uuid-generate';
// import firebase from 'react-native-firebase';
import { AppState, Platform } from "react-native";
import {
  checkNotifications,
  requestNotifications,
} from "react-native-permissions";

import Config from "~/Config";

// import { AppStore } from '~/Store';
// import { UserActions } from '~/Store/Actions';
import Dialog from "./Dialog";
import Logger from "./Logger";

const { DEFAULT_NOTIFICATION_CHANNEL_ID = "push-notification-channel" } =
  Config;
const TAG = "@FcmHelper";

export function presentNotification({
  title,
  body,
  data,
  id = `${new Date().getTime()}`,
}) {
  try {
    // const notification = new firebase.notifications.Notification({
    //   show_in_foreground: true,
    //   sound: 'default',
    // })
    //   .setNotificationId(id)
    //   .setTitle(title)
    //   .setBody(body)
    //   .setData(data);
    //
    // if (Platform.OS === 'android') {
    //   notification.android
    //     .setAutoCancel(true)
    //     .android.setSmallIcon('ic_notification_default')
    //     .android.setChannelId(DEFAULT_NOTIFICATION_CHANNEL_ID)
    //     .android.setPriority(firebase.notifications.Android.Priority.High)
    //     .android.setVibrate(500);
    // }
    //
    // firebase
    //   .notifications()
    //   .displayNotification(notification)
    //   .catch((err) => __DEV__ && console.warn(TAG, err.message, JSON.stringify(err, null, 2)));
  } catch (e) {
    return Logger.error(e);
  }
}

export async function hasPermission() {
  const { status } = await checkNotifications();
  return status === "granted";
}

export async function getToken() {
  try {
    // // handle appState changes, forcing user
    // // to allow app to access notification permission.
    // const handleAppStateChange = (status) => (state) => {
    //   if (state === 'active') {
    //     if (status !== 'granted') {
    //       return requestPermission();
    //     }
    //   }
    // };
    //
    // // request fcm token, and use uuid as fake token
    // // when using emulator.
    // const requestFcmToken = async () => {
    //   let fcmToken = UUID.generate();
    //   try {
    //     fcmToken = await firebase.messaging().getToken();
    //     // console.log('requestFcmToken fcmToken=>', fcmToken);
    //     // __DEV__ && Alert.alert(TAG, `get fcm token success, "${fcmToken}"`);
    //     // store.dispatch(UserActions.updateUserStore({ fcmToken }));
    //   } catch (error) {
    //     AppStore.dispatch(UserActions.updateUserStore({ fcmToken: null }));
    //     __DEV__ && console.warn(TAG, `get fcm token failure, "${fcmToken}"`);
    //   }
    //   return fcmToken;
    // };
    //
    // // trying to request notification permission from user,
    // // if successes, remove appState change listener.
    // const requestPermission = () =>
    //   checkNotifications().then(async ({ status, setting }) => {
    //     // type PermissionStatus = 'unavailable' | 'denied' | 'blocked' | 'granted';
    //     // setting = {"alert": false, "lockScreen": false, "notificationCenter": false, "sound": false}
    //     // console.log('status & settings', status, settings);
    //     switch (status) {
    //       case 'granted':
    //         AppState.removeEventListener('change');
    //         return await requestFcmToken();
    //       default:
    //         AppState.addEventListener('change', handleAppStateChange(status));
    //         return requestNotifications(['alert', 'sound']).then(async (res) => {
    //           // console.log('request notification: ', status, settings);
    //           if (Platform.OS === 'ios' && res.status === 'blocked') {
    //             // iOS only have once chance to show the permission dialog
    //             // if user had denied permission, you can only request him setting manually enable from setting
    //             return Dialog.requestFcmPermissionFromSystemAlert();
    //           }
    //           return await requestFcmToken();
    //         });
    //     }
    //   });
    // return requestPermission();
    return await messaging().getToken();
  } catch (e) {
    return Logger.error("@FcmHelper.getToken error: ", e);
  }
}

export default {
  presentNotification,
  getToken,
  hasPermission,
};
