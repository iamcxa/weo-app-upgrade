import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import ApiExampleScreen from "~/Container/Example/ApiExampleScreen";
import FcmExampleScreen from "~/Container/Example/FcmExampleScreen";
// Custom Scenes
import RootScreen from "~/Container/Example/RootScreen";

const RootStack = createNativeStackNavigator();

const getDisplayName = (comp) =>
  comp.displayName.replace("Connect(", "").replace(")", "");

const TopicScenes = () => (
  <RootStack.Navigator>
    <RootStack.Screen
      name={getDisplayName(RootScreen)}
      component={RootScreen}
    />
    <RootStack.Screen
      name={getDisplayName(ApiExampleScreen)}
      component={ApiExampleScreen}
    />
    <RootStack.Screen name="FcmExampleScreen" component={FcmExampleScreen} />
  </RootStack.Navigator>
);

export default TopicScenes;
