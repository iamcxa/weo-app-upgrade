import React from "react";
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  View,
} from "react-native";

import { Screen } from "App/Helpers";

const AvoidingView = ({ children, ...props }) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    keyboardVerticalOffset={
      Platform.OS === "ios"
        ? Screen.verticalScale(30)
        : Screen.verticalScale(24)
    }
    {...props}
    style={{ flex: 1 }}
  >
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
      style={{ flex: 1 }}
    >
      <View style={[{ flex: 1 }, props.style]}>{children}</View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);

export default AvoidingView;
