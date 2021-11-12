import {
  useFlipper,
  useReduxDevToolsExtension,
} from "@react-navigation/devtools";
import { NavigationContainer } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import * as React from "react";

import {
  useAppState,
  useLocalization,
  useNetInfo,
  useScreenOrientation,
} from "~/Hook";
import { GeolocationMonitor } from "~/Monitor";

import AppScenes from "./AppScenes";
import { navigationRef } from "./NavigatorContainerRef";

// export const navigationRef = NavigatorContainerRef;

export default () => {
  useReduxDevToolsExtension(navigationRef);
  useFlipper(navigationRef);
  useScreenOrientation(ScreenOrientation.OrientationLock.DEFAULT);
  useLocalization();
  useAppState();
  useNetInfo();
  return (
    <NavigationContainer ref={navigationRef}>
      <AppScenes navigation={navigationRef} />
      <GeolocationMonitor />
    </NavigationContainer>
  );
};
