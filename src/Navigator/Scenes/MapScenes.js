import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { SearchBar } from "~/Component";
import ApiExampleScreen from "~/Container/Example/ApiExampleScreen";
import FcmExampleScreen from "~/Container/Example/FcmExampleScreen";
// Custom Scenes
// import RootScreen from '~/Container/Example/RootScreen';
import MapScreen from "~/Container/MapScreen/MapScreen";
import RankingModel from "~/Container/MapScreen/RankingModel";

const RootStack = createNativeStackNavigator();

const getDisplayName = (comp) => {
  console.log("comp=>", comp);
  return comp.displayName.replace("Connect(", "").replace(")", "");
};

const NavigationOptions = {
  // headerTintColor: 'white',
  // headerStyle: { backgroundColor: 'tomato' },
  // headerShown: false,
};

const MapScenes = () => (
  <RootStack.Navigator screenOptions={NavigationOptions}>
    <RootStack.Screen
      name={getDisplayName(MapScreen)}
      component={MapScreen}
      options={{
        // headerTitleStyle:{height:72},
        // statusBarHeight:129,
        // headerShown: true,
        // headerStyle: {
        //   // backgroundColor: '#6ff',
        //   height:100,
        //   // marginVertical: 40
        // },
        // headerTitleStyle: {
        //   backgroundColor:'yellow',
        //   marginVertical: 20,
        // },
        // headerMode:'screen',
        // headerStatusBarHeight:120,
        // headerTitle: (props) => <SearchBar {...props} />,
        header: (props) => <SearchBar {...props} />,
      }}
    />
    <RootStack.Screen
      name={getDisplayName(ApiExampleScreen)}
      component={ApiExampleScreen}
    />
    <RootStack.Screen name="FcmExampleScreen" component={FcmExampleScreen} />
  </RootStack.Navigator>
);

export default MapScenes;
