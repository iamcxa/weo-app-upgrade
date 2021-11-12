import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import ApiExampleScreen from "~/Container/Example/ApiExampleScreen";
import FcmExampleScreen from "~/Container/Example/FcmExampleScreen";
// Custom Scenes
import RootScreen from "~/Container/Example/RootScreen";
import { Colors } from "~/Theme";

const RootStack = createNativeStackNavigator();

const getDisplayName = (comp) =>
  comp.displayName.replace("Connect(", "").replace(")", "");

const ChatScenes = () => (
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

ChatScenes.options = {
  tabBarBadge: 3,
  tabBarBadgeStyle: {
    backgroundColor: Colors.mainYellow,
    borderColor: "white",
    borderWidth: 1,
  },
};

export default ChatScenes;
