import { Platform } from "react-native";

export default {
  KEYBOARD_SHOW: Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
  KEYBOARD_HIDE: Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
  HARDWARE_BACK_PRESS: "hardwareBackPress",
};
