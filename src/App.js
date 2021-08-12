import 'expo-splash-screen';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { persistor, AppStore } from '~/Store';
import SplashScreen from '~/Container/Splash/SplashScreen';
import AppNavigator from '~/Navigator/AppNavigator';
import AppMonitor from '~/Monitor/AppMonitor';

export default () => {
  return (
    /**
     * @see https://github.com/reduxjs/react-redux/blob/master/docs/api/Provider.md
     */
    <Provider store={AppStore}>
      {/**
       * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
       * and saved to redux.
       * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
       * for example `loading={<SplashScreen />}`.
       *
       * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
       */}
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <AppNavigator />
        <AppMonitor />
      </PersistGate>
    </Provider>
  );
};
