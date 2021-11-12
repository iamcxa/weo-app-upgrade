import { Platform } from "react-native";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";

import reducers from "./Reducers";

export default () => {
  // Add middleware here
  const middleware = [];

  // Debug tool integration;
  let composeEnhancers = compose;

  if (__DEV__) {
    // Use it if Remote debugging with RNDebugger, otherwise use remote-redux-devtools
    composeEnhancers = (
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
      // eslint-disable-next-line global-require
      require("remote-redux-devtools").composeWithDevTools
    )({
      name: `${Platform.OS}-ApiRuntime`,
      trace: true,
      traceLimit: 10,
    });
  }

  // Create the store
  const store = createStore(
    combineReducers(reducers),
    composeEnhancers(applyMiddleware(...middleware))
  );

  // Enable hot module replacement for reducers
  if (module.hot) {
    module.hot.accept(async () => {
      const nextRootReducer = await import("./Reducers");
      store.replaceReducer(nextRootReducer);
    });
  }

  return {
    store,
  };
};
