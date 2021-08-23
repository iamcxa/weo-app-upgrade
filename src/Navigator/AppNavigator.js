import { useFlipper, useReduxDevToolsExtension } from '@react-navigation/devtools';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as React from 'react';

import { useAppState, useLocalization, useNetInfo, useScreenOrientation } from '~/Hook';

import AppScenes from './AppScenes';

export default () => {
  const navigationRef = useNavigationContainerRef();
  useReduxDevToolsExtension(navigationRef);
  useFlipper(navigationRef);
  useScreenOrientation(ScreenOrientation.OrientationLock.DEFAULT);
  useLocalization();
  useAppState();
  useNetInfo();
  return (
    <NavigationContainer ref={navigationRef}>
      <AppScenes />
    </NavigationContainer>
  );
};
