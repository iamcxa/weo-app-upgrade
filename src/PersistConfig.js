import asyncStorage from "@react-native-community/async-storage";

import Config from "~/Config";

import createMigrations from "./Migration";

/**
 * This import defaults to localStorage for web and AsyncStorage for react-native.
 *
 * Keep in mind this storage *is not secure*. Do not use it to store sensitive information
 * (like API tokens, private and sensitive data, etc.).
 *
 * If you need to store sensitive information, use redux-persist-sensitive-storage.
 * NOTICE: sensitive-storage will not wipe data when removing app in iOS.
 *
 * @see https://github.com/CodingZeal/redux-persist-sensitive-storage
 */

export default {
  key: "root",
  storage: asyncStorage,
  version: Config.STORE_VERSION,
  migrate: createMigrations,
  /**
   * Blacklist state that we do not need/want to persist
   */
  blacklist: [
    // 'auth',
    "appState",
  ],
};
