import UUID from "uuid-generate";
import firebase from "react-native-firebase";
import { Platform, Alert } from "react-native";
import { translate as t } from "~/Helper/I18n";
import Permissions, {
  checkNotifications,
  requestNotifications,
} from "react-native-permissions";
// import FCM, { FCMEvent } from 'react-native-fcm';
// import handleNotify from './handleNotify';

export function reopen({ updateAlert, updateNotifyAction }) {
  // FCM.getInitialNotification().then((_notify) => {
  //   try {
  //     console.log('getInitialNotification', _notify);
  //     if (_notify) {
  //       const notify = _notify;
  //       if (Platform.OS === 'ios') {
  //         // iOS
  //         handleNotify.get({ notify, updateAlert, updateNotifyAction });
  //       } else {
  //         // Android
  //         handleNotify.get({ notify, updateAlert, updateNotifyAction });
  //       }
  //     }
  //   } catch (error) {
  //     console.warn('FCM getInitialNotification error', error);
  //   }
  // });
}

export async function presentNotification({
  title,
  body,
  messageId = new Date().getTime(),
  channelId,
  showInForeground = true,
  local,
  //   priority: 'high',
  //   show_in_foreground: false,
  //   local: true,
  //   channel: NOTIFICATION_FOUND_NEW_CIRCLE,
}) {
  try {
    const notification = new firebase.notifications.Notification({
      show_in_foreground: showInForeground,
    })
      .setNotificationId(messageId)
      .setTitle(title)
      .setBody(body);

    if (Platform.OS === "android") {
      notification.android
        .setAutoCancel(true)
        .android.setChannelId(channelId)
        .android.setPriority(firebase.notifications.Android.Priority.High)
        .android.setVibrate(500);
    }

    firebase
      .notifications()
      .displayNotification(notification)
      .catch((err) => Alert.alert(err.message, JSON.stringify(err, null, 2)));
  } catch (e) {
    console.error(e);
  }
}

export async function getToken() {
  // const token = await FCM.getFCMToken();
  // return token;
  try {
    const requestFcmToken = async () => {
      console.log("getToken");
      const fcmToken = await firebase.messaging().getToken();
      console.log("requestFcmToken fcmToken=>", fcmToken);
      if (fcmToken) {
        // user has a device token
      } else {
        // user doesn't have a device token yet
      }
      return fcmToken || UUID.generate();
    };
    return checkNotifications().then(async ({ status, settings }) => {
      // type PermissionStatus = 'unavailable' | 'denied' | 'blocked' | 'granted';
      console.log("status & settings", status, settings);
      switch (status) {
        case "granted":
          return await requestFcmToken();
        default:
          requestNotifications(["alert", "sound"]).then(
            async ({ status, settings }) => {
              console.log("request notification: ", status, settings);
              if (Platform.OS === "ios" && status === "blocked") {
                // iOS only have once chance to show the permission dialog
                // if user had denied permission, you can only request him setting manually enable from setting
                return Alert.alert(
                  t("permission_request_title"),
                  t("permission_request_desc_notification"),
                  [
                    // {
                    //   text: t('__cancel'),
                    //   onPress: () => {},
                    //   style: 'cancel',
                    // },
                    {
                      text: t("__open_system_setting"),
                      onPress: Permissions.openSettings,
                    },
                  ]
                );
              }
              return await requestFcmToken();
            }
          );
      }
    });
  } catch (e) {
    console.log("FCM getToken fail: ", e);
    return null;
  }
}

export async function init({ updateAlert, updateNotifyAction }) {
  // console.group('[FCM]');
  // console.log('FCM init');
  // try {
  //   console.log('request FCM permissions');
  //   if (Platform.OS === 'ios') {
  //     console.log('ios');
  //     FCM.requestPermissions({ badge: false, sound: true, alert: true });
  //   }
  //   // FCM.requestPermissions({ badge: false, sound: true, alert: true });
  //   const token = await FCM.getFCMToken();
  //   console.log('FCM token', token);
  //   console.groupEnd();
  //   FCM.on(FCMEvent.Notification, async (notify) => {
  //     console.log('on FCMEvent.Notification');
  //     try {
  //       // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
  //       if (notify.local_notification) {
  //         //this is a local notification
  //         console.log('local notification', notify);
  //       }
  //       if (notify && notify.opened_from_tray) {
  //         //app is open / resumed because user clicked banner
  //         console.log('app is open / resumed because user clicked banner', notify);
  //       }
  //       handleNotify.get({ notify, updateAlert, updateNotifyAction });
  //     } catch (e) {
  //       console.group('[FCM] ERROR');
  //       console.warn('FCMEvent.Notification: ', e);
  //       console.groupEnd();
  //     }
  //   });
  // } catch (e) {
  //   console.group('[FCM] ERROR');
  //   console.warn('FCM INIT error: ', e);
  //   console.groupEnd();
  // }
}
