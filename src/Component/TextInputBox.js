import React from "react";
import {
  BaseVerticalTextInput,
  BaseHorizontalTextInput,
} from "./BaseTextInputBox";
import { Colors, Metrics } from "App/Theme";

const containerStyle = {
  height: "38@vs",
  paddingRight: 0,
  paddingLeft: 0,
  borderRadius: 6,
  backgroundColor: Colors.white,
  // marginTop: Metrics.baseMargin / 2,
  marginBottom: Metrics.baseMargin,

  elevation: 2,
  shadowColor: Colors.shadow,
  shadowOpacity: 0.4,
  shadowRadius: 1,
  shadowOffset: {
    height: 1,
    width: 3,
  },
};

const propTypes = {};

const defaultProps = {};

export const VerticalTextInput = ({
  // titleStyle,
  // inputStyle,
  // errorStyle,
  // requiredStyle,
  // containerStyle,
  // inputSize,
  // inputAlign,
  // value,
  // title,
  // error,
  // inputColor,
  // maxLength,
  // placeholder,
  // onChangeText,
  // onPress,
  // numberOfLines,
  // multiline,
  // height,
  // bold,
  // required,
  ...props
}) => {
  return (
    <BaseVerticalTextInput
      {...props}
      // containerStyle={[containerStyle, props.containerStyle]}
    />
  );
};

VerticalTextInput.propTypes = propTypes;
VerticalTextInput.defaultProps = defaultProps;

export const HorizontalTextInput = ({
  // titleStyle,
  // inputStyle,
  // errorStyle,
  // requiredStyle,
  // containerStyle,
  // inputSize,
  // inputAlign,
  // value,
  // title,
  // error,
  // inputColor,
  // maxLength,
  // placeholder,
  // onChangeText,
  // onPress,
  // numberOfLines,
  // multiline,
  // height,
  // ,
  // required,
  ...props
}) => {
  return (
    <BaseHorizontalTextInput
      {...props}
      // containerStyle={[containerStyle, props.containerStyle]}
    />
  );
};

HorizontalTextInput.propTypes = propTypes;
HorizontalTextInput.defaultProps = defaultProps;

export default {
  VerticalTextInput,
  HorizontalTextInput,
};
