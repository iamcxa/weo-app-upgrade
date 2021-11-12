import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { DevSettings, Platform } from "react-native";
import { Button } from "react-native-elements";

import ApiConsoleScreen from "~/Container/DevScreen/ApiConsoleScreen";

const Tab = createBottomTabNavigator();

const DevScenes = ({ navigation }) => (
  <Tab.Navigator
    screenOptions={{
      headerRight: (prop) => (
        <Button
          type="clear"
          onPress={navigation.goBack}
          icon={{
            name: "clear",
          }}
        />
      ),
    }}
  >
    <Tab.Screen
      name="ApiConsoleScreen"
      component={ApiConsoleScreen}
      options={ApiConsoleScreen.options}
    />
  </Tab.Navigator>
);

DevScenes.screenOptions = {
  headerBackVisible: true,
};

DevScenes.useDevMenu = (navigation = () => {}) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (Platform.OS !== "web" && count === 0) {
      DevSettings.addMenuItem("--> DEV PANEL <--", () => {
        console.log("Change me at the RootScreen", navigation);

        navigation.current.navigate(DevScenes.name);
        setCount(1);
      });
    }
  }, [count, navigation]);
};

export default DevScenes;
