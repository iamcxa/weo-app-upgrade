import { SIZE_MATTERS_BASE_HEIGHT, SIZE_MATTERS_BASE_WIDTH } from '@env';
import { Dimensions, PixelRatio } from 'react-native';
import {
  getBottomSpace,
  getStatusBarHeight,
  ifIphoneX,
  isIphoneX,
} from 'react-native-iphone-x-helper';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  ScaledSheet,
  verticalScale,
} from 'react-native-size-matters';

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  ScaledSheet,
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  onePixel: 1 / PixelRatio.get(),

  ifIphoneX,
  isIphoneX,
  getStatusBarHeight,
  getBottomSpace,
};

if (SIZE_MATTERS_BASE_HEIGHT && SIZE_MATTERS_BASE_WIDTH) {
  const extend = import('react-native-size-matters/extend');

  Screen.scale = extend.scale;
  Screen.ScaledSheet = extend.ScaledSheet;
  Screen.verticalScale = extend.verticalScale;
  Screen.moderateScale = extend.moderateScale;
  Screen.moderateVerticalScale = extend.moderateVerticalScale;
}

const StyleSheet = ScaledSheet;
export {
  getBottomSpace,
  getStatusBarHeight,
  ifIphoneX,
  isIphoneX,
  ScaledSheet,
  Screen,
  StyleSheet,
};
