import React, { useEffect, useReducer, useRef, useState } from "react";
import { Text, View } from "react-native";
import { Button, Overlay } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";

import {
  ApiStore,
  useSelector as useApiSelector,
} from "~/Api/ApiHandler/Store";
import { navigationRef } from "~/Navigator/NavigatorContainerRef";

import MemberApiSection from "./ApiConsole/MemberApiSection";

const ApiConsoleScreen = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  return (
    <View style={ApiConsoleScreen.styles.container}>
      <MemberApiSection
        dispatch={dispatch}
        navigation={navigationRef}
        toggleOverlay={toggleOverlay}
      />
    </View>
  );
};

ApiConsoleScreen.styles = {};

export default ApiConsoleScreen;
