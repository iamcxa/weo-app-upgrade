import * as React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useFlipper, useReduxDevToolsExtension } from '@react-navigation/devtools';

import AppScenes from './AppScenes';

export default function AppNavigator() {
  const navigationRef = useNavigationContainerRef();

  if (__DEV__) {
    useReduxDevToolsExtension(navigationRef);
    useFlipper(navigationRef);
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <AppScenes />
    </NavigationContainer>
  );
}
