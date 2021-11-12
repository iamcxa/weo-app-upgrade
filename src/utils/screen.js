import { Dimensions, Platform, PixelRatio } from "react-native";
import DeviceInfo from "react-native-device-info";

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;
const { width, height } = Dimensions.get("window");
const proportionValue =
  Dimensions.get("screen").width / Dimensions.get("screen").height;

const dimensionsHeight = height;

const scale = (size) => (height / guidelineBaseWidth) * size;

const moderateScale = (size) => {
  const scaleT = (size) => {
    const factor = height * 0.0015;
    return size * factor;
  };

  return size + (scaleT(size) - size);
};

const verticalScale = (size) => (height / guidelineBaseHeight) * size;

const isX = !!(Platform.OS === "ios" && (height > 800 || width > 800));

const screen = {
  width,
  height,
  proportion:
    proportionValue >= 0.75 ? "4:3" : proportionValue >= 0.6 ? "16:10" : "16:9",
  virtualBar:
    Platform.OS === "ios"
      ? false
      : dimensionsHeight !== Dimensions.get("screen").height,
  onePixel: 1 / PixelRatio.get(),
  statusBarHeight: Platform.OS === "ios" ? 20 : 0,
  keyboardShow: Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
  keyboardHide: Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
  hardwareWidth:
    Dimensions.get("window").width * Dimensions.get("window").scale,
  hardwareHeight:
    Dimensions.get("window").height * Dimensions.get("window").scale,
  // tabHeight: Dimensions.get('window').width * Dimensions.get('window').scale > 1080 ? DeviceInfo.isTablet() ? moderateScale(61) : 61 : 56,
  //tabHeight: Dimensions.get('window').width * Dimensions.get('window').scale > 1080 ? DeviceInfo.isTablet() ? moderateScale(61) : moderateScale(61) : DeviceInfo.isTablet() ? moderateScale(56) : 56,
  tabHeight: moderateScale(56),
  size:
    Dimensions.get("window").width * Dimensions.get("window").scale > 1080
      ? "L"
      : "S",
  verticalScale,
  moderateScale,
  // screenSize:
  isX,
};

export default screen;
