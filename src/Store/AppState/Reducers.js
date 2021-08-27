/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { createReducer } from 'reduxsauce';

import { AppStateTypes } from './Actions';
import { INITIAL_STATE } from './InitialState';

export const onAppVersionUpdate = (state, { appVersion, buildVersion, bundleIdentifier }) => ({
  ...state,
  currentVersion: {
    appVersion,
    buildVersion,
    bundleIdentifier,
  },
});

export const onLoadingUpdate = (state, { isLoading, message, options }) => {
  return {
    ...state,
    isLoading,
    loadingMessage: message,
    loadingOptions: options,
  };
};

export const onAppStateUpdate = (state, { currentState }) => ({
  ...state,
  currentState,
});

export const onDeviceUpdate = (state, { device }) => ({
  ...state,
  currentDevice: {
    ...state.currentDevice,
    ...device,
  },
});

export const onLocaleUpdate = (state, { localization }) => ({
  ...state,
  localization,
});

export const onOrientationUpdate = (state, { currentOrientation }) => ({
  ...state,
  currentOrientation,
});

export const onNetInfoUpdate = (state, action) => ({
  ...state,
  netInfo: action.state,
});

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  // [AppStateTypes['APP/ON_DEVICE_UPDATE']]: onDeviceUpdate,
  [AppStateTypes['APP/ON_LOCALE_UPDATE']]: onLocaleUpdate,
  [AppStateTypes['APP/ON_STATE_UPDATE']]: onAppStateUpdate,
  [AppStateTypes['APP/ON_NET_INFO_UPDATE']]: onNetInfoUpdate,
  [AppStateTypes['APP/ON_LOADING']]: onLoadingUpdate,
  [AppStateTypes['APP/ON_VERSION_UPDATE']]: onAppVersionUpdate,
  [AppStateTypes['APP/ON_ORIENTATION_UPDATE']]: onOrientationUpdate,
});
