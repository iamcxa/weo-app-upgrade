import React from "react";

import { Screen } from "~/Helper";
import { Images } from "~/Theme";

const navigatorOptions = {
  //
  rootNavigator: ({ route }) => ({
    tabBarShowLabel: false,
    headerShown: false,
  }),

  //
  tabNavigator: ({ route }) => ({
    tabBarShowLabel: false,
    headerShown: false,
    tabBarIcon: ({ focused, color, size }) => {
      const Component = focused
        ? Images[`SvgTabBar${route.name}Filled`]
        : Images[`SvgTabBar${route.name}`];
      return <Component width={Screen.scale(28)} height={Screen.scale(28)} />;
    },
  }),

  //
  transparentModal: ({ route }) => ({
    presentation: "containedTransparentModal",
    headerShown: false,
    cardStyle: { backgroundColor: "transparent" },
    cardOverlayEnabled: true,
    // cardStyleInterpolator: ({ current: { progress } }) => ({
    //   cardStyle: {
    //     opacity: progress.interpolate({
    //       inputRange: [0, 0.5, 0.9, 1],
    //       outputRange: [0, 0.1, 0.3, 0.7],
    //     }),
    //   },
    //   overlayStyle: {
    //     opacity: progress.interpolate({
    //       inputRange: [0, 1],
    //       outputRange: [0, 0.6],
    //       extrapolate: 'clamp',
    //     }),
    //   },
    // }),
  }),

  //
  presentedModal: ({ route }) => ({
    presentation: "modal",
  }),
};

export default navigatorOptions;
