import { ENV_DEVELOP, ENV_LOCAL, ENV_STANDARD } from "@env";
import { Platform } from "react-native";

import API from "./Api";
import LOGGER from "./Logger";

export default {
  // App basic info
  // APP_VERSION: version,
  API,
  LOGGER,
  ENV_DEVELOP,
  ENV_LOCAL,
  ENV_STANDARD,

  // Store
  STORE_VERSION: 1,

  // Api
  API_TIMEOUT: 10 * 1000,
  API_VERSION: "/v2",
  API_BASE_URL: "http://127.0.0.1:5100",
  // API_BASE_URL: 'https://jsonplaceholder.typicode.com',

  shareAPI_BASE_URL: "https://share.letsweo.com",
  ...Platform.select({
    ios: {
      version: "1.3.0",
    },
    android: {
      version: "1.3.0",
    },
  }),
  aes: {
    key: "1234567812345678",
    iv: "1234567812345678",
  },
  openFetchLog: true,
  YellowBoxDisabled: !__DEV__,
  YellowBoxIgnoreWarnings: ["Require cycle:"],
  timeout: 10 * 1000,

  // API
  // API_TIMEOUT: 15 * 1000,
  // API_VERSION: '',
  // API_BASE_URL: '',
  API_SERVER_TIME_ZONE: "Asia/Hong_Kong",

  // App UI i18n
  UI_SUPPORT_LANGUAGES: ["en", "zh_HK"],

  // NOTIFICATION
  DEFAULT_NOTIFICATION_CHANNEL_ID: "push-notification-channel",
  DEFAULT_NOTIFICATION_CHANNEL_NAME: "WeO Push Notification Receiver",

  // APP FUNCTION OPTIMIZE
  SPLASH_REDIRECT_DELAY: 400, // millisecond
  NOTIFICATION_REDIRECT_DELAY: 700, // millisecond
  BUTTON_DEBOUNCE: 500, // millisecond
  BUTTON_THROTTLE: 500, // millisecond
  ON_END_REACHED_THROTTLE: 1000, // millisecond
  STAY_CIRCLE_TIME: 15 * 60, // seconds
  LEFT_APP_TIMEOUT: 3, // hours
  LOCATION_THROTTLE: 5 * 60 * 1000, // millisecond
  CHECK_CURRENT_CIRCLE_THROTTLE: 5 * 60 * 1000, // millisecond
  ON_GEOFENCE_THROTTLE: 1 * 60 * 1000, // millisecond
  NOTIFICATION_FOUND_NEW_CIRCLE: "NOTIFICATION_FOUND_NEW_CIRCLE",

  // APP CONTENT
  iosDownloadLink: "https://itunes.apple.com/hk/app/weo/id1421655724?l=zh",
  androidDownloadLink:
    "https://play.google.com/store/apps/details?id=hk.com.weo.app",
  mockup: false,

  // APP LAYOUT
  REPLY_BAR_HEIGHT: 64,

  // Firebase
  FIREBASE_DYNAMIC_LINK_KEY: "AIzaSyC3HKFrOjZnLh3gaq6giv4M1UPlF6XOvy0",
};
