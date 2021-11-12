import { Platform } from "react-native";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";
import appJson from "../app.json";
import reducers from "~/Store/Reducers";

import PersistConfig from "./PersistConfig";

// Connect the sagas to the redux store
export const sagaMiddleware = createSagaMiddleware();

// Redux persist
export const persistedReducers = persistReducer(
  PersistConfig,
  combineReducers(reducers)
);

export default () => {
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
      // eslint-disable-next-line global-require
      require("remote-redux-devtools").composeWithDevTools
    )({
      name: `${Platform.OS}-${appJson.name}`,
      trace: true,
      traceLimit: 10,
    });
  }

  // Create the store
  const store = createStore(
    persistedReducers,
    composeEnhancers(applyMiddleware(...middleware))
  );

  // Enable hot module replacement for reducers
  if (module.hot) {
    module.hot.accept(async () => {
      const nextRootReducer = await import("~/Store/Reducers");
      store.replaceReducer(nextRootReducer);
    });
  }

  return {
    persistor: persistStore(store),
    store,
    sagaMiddleware,
  };
};
