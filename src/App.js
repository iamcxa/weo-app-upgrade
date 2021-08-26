import "expo-splash-screen";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";

import SplashScreen from "~/Container/Splash/SplashScreen";
import AppNavigator from "~/Navigator/AppNavigator";
import { AppStore, persistor } from "~/Store";

export default () => {
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
    <Provider store={AppStore}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
};
