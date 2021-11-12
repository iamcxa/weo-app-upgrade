import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import RankingModel from "~/Container/MapScreen/RankingModel";
import TopicModel from "~/Container/MapScreen/TopicModel";

import NavigatorOptions from "./NavigatorOptions";
import ChatScenes from "./Scenes/ChatScenes";
import DevScenes from "./Scenes/DevScenes";
import MapScenes from "./Scenes/MapScenes";
import NotificationScenes from "./Scenes/NotificationScenes";
import ProfileScenes from "./Scenes/ProfileScenes";
import TopicScenes from "./Scenes/TopicScenes";

const RootStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const HomeTabs = () => (
  <Tab.Navigator screenOptions={NavigatorOptions.tabNavigator}>
    <Tab.Screen name={MapScenes.name} component={MapScenes} />
    <Tab.Screen name={TopicScenes.name} component={TopicScenes} />
    <Tab.Screen
      name={ChatScenes.name}
      component={ChatScenes}
      options={ChatScenes.options}
    />
    <Tab.Screen
      name={NotificationScenes.name}
      component={NotificationScenes}
      options={NotificationScenes.options}
    />
    <Tab.Screen name={ProfileScenes.name} component={ProfileScenes} />
  </Tab.Navigator>
);

export default ({ navigation }) => {
  if (__DEV__) {
    DevScenes.useDevMenu(navigation);
  }
  return (
    <RootStack.Navigator screenOptions={NavigatorOptions.rootNavigator}>
      <RootStack.Screen name="Home" component={HomeTabs} />

      <RootStack.Group screenOptions={NavigatorOptions.presentedModal}>
        <RootStack.Screen name="RankingModel" component={RankingModel} />
        <RootStack.Screen name="TopicModel" component={TopicModel} />
      </RootStack.Group>

      <RootStack.Group screenOptions={NavigatorOptions.transparentModal}>
        <RootStack.Screen name={DevScenes.name} component={DevScenes} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};
