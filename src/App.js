import "expo-splash-screen";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";

import { ApiProvider } from "~/Api/ApiHandler/Store";
import SplashScreen from "~/Container/Splash/SplashScreen";
import AppNavigator from "~/Navigator";
import rootSaga from "~/Saga";
import { AppStore, persistor, sagaMiddleware } from "~/Store";

export default () => {
  // Kick off the root saga
  sagaMiddleware.run(rootSaga);

  // const ApiStoreProvider = CreateApiStore();

  return (
    /**
     * @see https://github.com/reduxjs/react-redux/blob/master/docs/api/Provider.md
     */
    /**
     * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
     * and saved to redux.
     * The `loading` prop can be `null` or any react instance to show during loading (eg. a splash screen),
     * for example `loading={<SplashScreen />}`.
     *
     * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
     */
    <>
      <ApiProvider />
      <Provider store={AppStore}>
        <PersistGate loading={<SplashScreen />} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    </>
  );
};
