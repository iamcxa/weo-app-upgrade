import { Platform, Animated, findNodeHandle } from "react-native";
import moment from "moment";
import Screen from "./screen";

// const RCTUIManager = require('NativeModules').UIManager;

const keyboard = {
  keyboardHide: ({ iosKeyboardHeight }) => {
    // if (Platform.OS === 'ios' && iosKeyboardHeight) {
    //   console.log('keyboardHide');
    //   Animated.timing(iosKeyboardHeight, {
    //     toValue: 0,
    //   }).start();
    // }
  },
  keyboardShow: ({ ref, iosKeyboardHeight, toValue, scrollViewRef }) => {
    // toValue = toValue || 100;
    // if (Platform.OS === 'ios' && RCTUIManager && ref) {
    //   RCTUIManager.measure(findNodeHandle(ref), (x, y, width, height, pageX, pageY) => {
    //     if (scrollViewRef) {
    //       if (pageY > Screen.height / 2) {
    //         scrollViewRef.scrollTo({
    //           y: pageY - Screen.height / 2 + toValue,
    //           animated: true,
    //         });
    //       } else {
    //         Animated.timing(iosKeyboardHeight, {
    //           toValue: pageY - toValue || 100,
    //         }).start();
    //       }
    //     } else {
    //       // Got me some dimensions
    //       if (pageY > Screen.height / 2 || iosKeyboardHeight._value > 0) {
    //         Animated.timing(iosKeyboardHeight, {
    //           toValue,
    //         }).start();
    //       }
    //     }
    //   });
    // }
  },
};
export default keyboard;
