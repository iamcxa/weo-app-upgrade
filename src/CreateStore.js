/* eslint-disable global-require */
import asyncStorage from "@react-native-community/async-storage";
import { Platform } from "react-native";
import { applyMiddleware, compose, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";

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

const persistConfig = {
  key: "root",
  storage: asyncStorage,
  version: 1,
  migrate: createMigrations,
  /**
   * Blacklist state that we do not need/want to persist
   */
  blacklist: [
    // 'auth',
  ],
};

export default (rootReducer, rootSaga) => {
  // Redux persist
  const persistedReducers = persistReducer(persistConfig, rootReducer);

  // Connect the sagas to the redux store
  const sagaMiddleware = createSagaMiddleware();

  // Add middleware here
  const middleware = [];
  middleware.push(sagaMiddleware);
  middleware.push(thunk);

  // Debug tool integration;
  let composeEnhancers = compose;

  if (__DEV__) {
    // Use it if Remote debugging with RNDebugger, otherwise use remote-redux-devtools
    composeEnhancers = (
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
      require("remote-redux-devtools").composeWithDevTools
    )({
      name: Platform.OS,
      trace: true,
      traceLimit: 10,
    });
  }

  // Enable hot module replacement for reducers
  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require("~/Store").default;
      store.replaceReducer(nextRootReducer);
    });
  }

  // Create the store
  const store = createStore(
    persistedReducers,
    composeEnhancers(applyMiddleware(...middleware))
  );

  // Kick off the root saga
  sagaMiddleware.run(rootSaga);

  return {
    persistor: persistStore(store),
    store,
  };
};
