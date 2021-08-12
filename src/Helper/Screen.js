import { SIZE_MATTERS_BASE_HEIGHT, SIZE_MATTERS_BASE_WIDTH } from '@env';
import { Dimensions, PixelRatio } from 'react-native';
import {
  ifIphoneX,
  isIphoneX,
  getStatusBarHeight,
  getBottomSpace,
} from 'react-native-iphone-x-helper';

import {
  ScaledSheet,
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from 'react-native-size-matters';

let Screen = {
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
  const extend = require('react-native-size-matters/extend');

  Screen = {
    ...Screen,
    ScaledSheet: extend.ScaledSheet,
    scale: extend.scale,
    verticalScale: extend.verticalScale,
    moderateScale: extend.moderateScale,
    moderateVerticalScale: extend.moderateVerticalScale,
  };
}

const StyleSheet = ScaledSheet;
export {
  ScaledSheet,
  StyleSheet,
  Screen,
  ifIphoneX,
  isIphoneX,
  getStatusBarHeight,
  getBottomSpace,
};
