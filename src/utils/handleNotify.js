import { Platform, Alert } from "react-native";
import { Actions } from "react-native-router-flux";
// import FCM, {
//   FCMEvent,
//   RemoteNotificationResult,
//   WillPresentNotificationResult,
//   NotificationType,
// } from 'react-native-fcm';
import { getItem } from "./asyncStorage";
import Storage from "App/constant/storage";
import { store } from "App/App";
import {
  resetNotification,
  receiveNotificationList,
} from "App/Stores/Notification/Actions";
import { fetchAPI, apiAction } from "./api";
import Config from "~/Config";

const handleNotify = {
  get: ({ notify, updateAlert, updateNotifyAction }) => {
    try {
      console.log("#####################");
      const notifyData = handleNotify.format(notify);
      console.log("notify", notify, handleNotify.format(notify));
      if (notifyData.messageId) {
        // get notifications list
        fetchAPI(apiAction.GET_NOTIFICATION_LIST).then((res) => {
          if (res.success) {
            store.dispatch(resetNotification());
            store.dispatch(receiveNotificationList(res.data.items));
          }
        });
        if (notify.opened_from_tray) {
          // 從背景點推播進 APP
          console.log("background to APP", notify);
          setTimeout(() => {
            handleNotify.action({
              type: notifyData.type,
              title: notifyData.title,
              service: notifyData.service,
              updateNotifyAction,
              actionSubject: notifyData.actionSubject,
              actionTime: notifyData.actionTime,
              message: notifyData.message,
              actionType: notifyData.actionType,
              attachData: notifyData.attachData,
            });
          }, 300);
        } else {
          // 前景收到 APP
          updateAlert({
            ...notifyData,
            id: notifyData.messageId,
            title: notifyData.title,
            desc: notifyData.message,
            status: "show",
            type: notifyData.type,
            service: notifyData.service,
            actionSubject: notifyData.actionSubject,
            actionTime: notifyData.actionTime,
            actionType: notifyData.actionType,
          });
        }
      }
    } catch (error) {
      console.warn(error);
    }
  },
  format: (notify) => {
    try {
      const result = {};
      console.log("===========================");
      console.log("ad", notify);
      if (Platform.OS === "ios") {
        result.messageId = notify["gcm.message_id"];
        result.title = notify.aps.alert.title;
        result.message = notify.aps.alert.body;
        result.type = JSON.parse(notify.alertType).StringValue;
        result.service = notify.service
          ? JSON.parse(notify.service).StringValue
          : "";
        result.actionSubject = notify.actionSubject
          ? JSON.parse(notify.actionSubject).StringValue
          : "";
        result.actionTime = notify.actionTime
          ? JSON.parse(notify.actionTime).StringValue
          : "";
        result.actionType = notify.actionType
          ? JSON.parse(notify.actionType).StringValue
          : "";
      } else if (notify["google.message_id"]) {
        if (notify.opened_from_tray) {
          // Android 在背景收到通知，點起 APP
          console.log("Android background");
          result.messageId = notify["google.message_id"];
          result.title = notify.fcm.title;
          result.message = notify.fcm.body;
          result.type = JSON.parse(notify.alertType).StringValue;
          result.service = notify.service
            ? JSON.parse(notify.service).StringValue
            : "";
          result.actionSubject = notify.actionSubject
            ? JSON.parse(notify.actionSubject).StringValue
            : "";
          result.actionTime = notify.actionTime
            ? JSON.parse(notify.actionTime).StringValue
            : "";
          // result.type = JSON.parse(notify.notification.alertType).StringValue;
          // result.service = notify.service ? JSON.parse(notify.notification.service).StringValue : '';
          // result.actionSubject = notify.notification.actionSubject ? JSON.parse(notify.notification.actionSubject).StringValue : '';
          // result.actionTime = notify.notification.actionTime ? JSON.parse(notify.notification.actionTime).StringValue : '';
        } else {
          console.log("Android foreground");
          // Android 在前景收到通知
          result.messageId = notify["google.message_id"];
          result.title = notify.fcm.title;
          result.message = notify.fcm.body;
          result.type = JSON.parse(notify.alertType).StringValue;
          result.service = notify.service
            ? JSON.parse(notify.service).StringValue
            : "";
          result.actionSubject = notify.actionSubject
            ? JSON.parse(notify.actionSubject).StringValue
            : "";
          result.actionTime = notify.actionTime
            ? JSON.parse(notify.actionTime).StringValue
            : "";
        }
      }
      result.actionType = notify.actionType
        ? JSON.parse(notify.actionType).StringValue
        : "";
      result.attachData = notify.attachData
        ? JSON.parse(JSON.parse(notify.attachData).StringValue)
        : null;
      return result;
    } catch (error) {
      console.warn(error);
    }
  },
  action: async ({
    updateNotifyAction,
    type,
    title,
    service,
    actionSubject,
    actionTime,
    message,
    actionType,
    attachData,
  }) => {
    updateNotifyAction({ isAction: false, type, service });
    console.log("handle notify action", actionType, attachData);
    const userCircle = await getItem(Storage.USER_CIRCLE);
    const homeCircle = await getItem(Storage.SET_THERE_YOU_ARE);
    let circleType = "hereYouAre";
    if (attachData.circleId === userCircle.id) {
      circleType = "hereYouAre";
    } else if (homeCircle && attachData.circleId === homeCircle.id) {
      circleType = "thereYouAre";
    } else {
      circleType = "browse";
    }
    let screenKey;

    const data = {};
    let idKey;
    let idKeyValue;
    switch (actionType) {
      case "NEW_TOPIC_POST":
        screenKey = "postList";
        idKey = "topicId";
        idKeyValue = attachData.parentId;
        data.highlightPostId = attachData.targetId;
        break;
      case "NEW_POST_REPLY":
        screenKey = "replyList";
        idKey = "postId";
        idKeyValue = attachData.parentId;
        data.highlightReplyId = attachData.targetId;
        break;
      case "NEW_VOTE":
        switch (attachData.schemaType) {
          case "TOPIC":
            screenKey = "postList";
            idKey = "topicId";
            idKeyValue = attachData.targetId;
            data.highlightHeader = true;
            break;
          case "POST":
            screenKey = "replyList";
            idKey = "postId";
            idKeyValue = attachData.targetId;
            data.highlightHeader = true;
            break;
          case "REPLY":
            screenKey = "replyList";
            idKey = "postId";
            idKeyValue = attachData.parentId;
            data.highlightReplyId = attachData.targetId;
            break;
          default:
        }
        break;
      default:
    }
    if (idKey) {
      const targetSceneKey = `${circleType}_${screenKey}`;
      setTimeout(() => {
        Actions[targetSceneKey]({
          [idKey]: idKeyValue,
          ...data,
        });
      }, Config.NOTIFICATION_REDIRECT_DELAY);
    }
  },
};
export default handleNotify;
