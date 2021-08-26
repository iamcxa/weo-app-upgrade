import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  PixelRatio,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "App/Theme/Colors";
import Screen from "../utils/screen";
import { Bage } from "../widget/RoundButton";

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    // marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: Screen.onePixel,
    borderBottomColor: Colors.silver,
    // paddingBottom: 12
  },
  input: {
    marginLeft: 10,
    // height: Screen.moderateScale(40),
    ...Platform.select({
      ios: {
        height: Screen.moderateScale(40),
      },
      android: {
        height: Screen.moderateScale(50),
      },
    }),
    flex: 1,
    borderColor: "#666",
    borderWidth: 0,
    ...Platform.select({
      ios: {
        fontSize: Screen.moderateScale(18),
      },
      android: {
        fontSize: Screen.moderateScale(
          Math.floor(18 / PixelRatio.getFontScale())
        ),
      },
    }),
    color: Colors.black,
  },
  equalWidthfont: {
    ...Platform.select({
      ios: {
        fontFamily: "Verdana",
      },
      android: {
        fontFamily: "monospace",
      },
    }),
  },
  label: {
    fontSize: Screen.moderateScale(16),
    letterSpacing: -0.22,
    textAlign: "left",
    color: Colors.greyishBrown,
  },
  labelImage: {
    marginRight: Screen.moderateScale(6),
    width: Screen.moderateScale(25),
    height: Screen.moderateScale(25),
  },
  afterText: {
    height: Screen.moderateScale(18),
    fontSize: Screen.moderateScale(16),
    fontWeight: "500",
    letterSpacing: -0.22,
    textAlign: "right",
    color: Colors.greyishBrown,
  },
  errorText: {
    fontSize: Screen.moderateScale(13),
    color: Colors.dustyRed,
  },
  mask: {
    position: "absolute",
    zIndex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: "rgba(0,0,0,0)",
        left: Screen.moderateScale(30),
        height: Screen.moderateScale(25),
      },
      android: {
        left: Screen.moderateScale(35),
        height: Screen.moderateScale(30),
      },
    }),
  },
  noLabelMask: {
    ...Platform.select({
      ios: {
        left: Screen.moderateScale(-3),
      },
      android: {
        left: Screen.moderateScale(5),
      },
    }),
  },
});

export default class InputBox extends Component {
  static propTypes = {
    label: PropTypes.string,
    labelImage: PropTypes.number,
    labelStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    labelColor: PropTypes.string,
    inputStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    onChangeText: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    errorContainerStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    keyboardType: PropTypes.string,
    autoCapitalize: PropTypes.string,
    returnKeyType: PropTypes.string,
    secureTextEntry: PropTypes.bool,
    showSecureBtn: PropTypes.bool,
    autoCorrect: PropTypes.bool,
    isRequire: PropTypes.bool,
    pattern: PropTypes.string,
    onError: PropTypes.func,
    onPass: PropTypes.func,
    onEndEditing: PropTypes.func,
    onFocus: PropTypes.func,
    onChangeValid: PropTypes.bool,
    afterText: PropTypes.string,
    afterTextStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    isError: PropTypes.bool,
    hideValue: PropTypes.bool,
    hideType: PropTypes.string,
    editable: PropTypes.bool,
    errorText: PropTypes.string,
    errorTextStyle: PropTypes.any,
    onSubmitEditing: PropTypes.func,
    maxNum: PropTypes.number,
    minNum: PropTypes.number,
    maxLength: PropTypes.number,
    isMaskInput: PropTypes.bool,
    maskPattern: PropTypes.string,
    multiline: PropTypes.bool,
    blurOnSubmit: PropTypes.bool,
    rightContent: PropTypes.element,
    autoFocus: PropTypes.bool,
  };

  static defaultProps = {
    returnKeyType: "next",
    autoCorrect: false,
    autoCapitalize: "none",
    onError: () => {},
    onPass: () => {},
    onEndEditing: () => {},
    onChangeValid: true,
    // isError: false,
    hideValue: false,
    hideType: "none",
    editable: true,
    errorText: "",
    placeholderTextColor: Colors.silver,
    onSubmitEditing: () => {},
    isMaskInput: false,
    maskPattern: "none",
    multiline: false,
    blurOnSubmit: true,
    rightContent: null,
    maxNum: null,
    minNum: null,
    showSecureBtn: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      isHide: true,
      isError: false,
      str: "",
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isError !== undefined) {
      this.setState({
        isError: nextProps.isError,
      });
    }
  }

  test = (str) => {
    Alert.alert(str, "I catch you");
  };

  focus = () => {
    if (this.input) {
      this.input.focus();
    }
  };

  onChange = (str) => {
    const { onChangeValid, onChangeText, maxNum, minNum, maxLength } =
      this.props;
    if (maxLength && str.length > maxLength) {
      return;
    }
    if (onChangeValid) this.checkPattern(str || "");
    this.setState({ str });
    onChangeText(str);
  };

  onEnd = () => {
    const { value, onEndEditing, minNum, onChangeText } = this.props;
    const result = this.checkPattern(value || "");
    onEndEditing();
    return result;
  };

  getErrorStyle = () => {
    const errorStyle = {};
    if (this.props.isError || this.state.isError) {
      errorStyle.container = {
        borderBottomColor: Colors.rosyPink,
        // marginBottom: 5,
        ...this.props.errorStyle.container,
      };
      errorStyle.text = {
        color: Colors.rosyPink,
        ...this.props.errorStyle.text,
      };
      errorStyle.placeholderTextColor =
        this.props.errorStyle.placeholderTextColor || Colors.rosyPink;
    }
    return errorStyle;
  };

  before = () => {
    const { label, labelStyle, labelColor, labelImage } = this.props;
    let dom = null;
    const errorStyle = this.getErrorStyle();
    if (label) {
      dom = (
        <Text
          style={[
            styles.label,
            labelStyle,
            { color: labelColor },
            errorStyle.text,
          ]}
        >
          {label}
        </Text>
      );
    } else if (labelImage) {
      dom = (
        <Image
          cache="reload"
          style={[styles.labelImage, labelStyle]}
          source={labelImage}
          resizeMode="contain"
        />
      );
    }
    return dom;
  };

  checkPattern = (str) => {
    const { pattern, onError, onPass, isRequire, isError, maxNum, minNum } =
      this.props;
    if (str.length === 0) {
      if (isRequire) {
        this.setState({ isError: true });
        onError();
        return false;
      }
      this.setState({ isError: isError || false });
      onPass();
      return true;
    }
    if (this.props.pattern || maxNum !== null || minNum !== null) {
      const re = new RegExp(pattern, "g");
      const invalid = !re.test(str);
      let rangeFail = false;
      if (maxNum && parseInt(str, 10) > maxNum) {
        rangeFail = true;
      }
      if (minNum && parseInt(str, 10) < minNum) {
        rangeFail = true;
      }
      if (invalid || rangeFail) {
        this.setState({ isError: isError || true });
        onError();
        return false;
      }
      this.setState({ isError: isError || false });
      onPass();
      return true;
    }
    this.setState({ isError: isError || false });
    onPass();
    return true;
  };

  render() {
    const {
      inputStyle,
      onFocus,
      value,
      placeholder,
      placeholderTextColor,
      style,
      errorContainerStyle,
      keyboardType,
      autoCapitalize,
      returnKeyType,
      secureTextEntry,
      showSecureBtn,
      autoCorrect,
      afterText,
      afterTextStyle,
      hideValue,
      hideType,
      editable,
      errorText,
      errorTextStyle,
      onSubmitEditing,
      maxLength,
      isMaskInput,
      maskPattern,
      label,
      labelImage,
      multiline,
      blurOnSubmit,
      rightContent,
      autoFocus,
    } = this.props;
    const errorStyle = this.getErrorStyle();

    const hide = {
      none: (str) => str,
      telephone: (str) => str.replace(/.{3}$/, "***"),
      phone: (str) => str.replace(/(.{5}).{3}/, "$1***"),
      identity: (str) =>
        this.state.isHide ? str.replace(/.{4}$/, "****") : str,
      billingAddress: (str) => str.replace(/(區|里).*$/, "$1******"),
      address: (str) => str.replace(/.{6}$/, "******"),
      name: (str) => {
        if (str.length === 2) {
          return str.replace(/.$/, "*");
        } else if (str.length === 3) {
          return str.replace(/(.)./, "$1*");
        }
        return str.replace(/(^.)(.*)(.$)/, "$1**$3");
      },
    };
    // isMaskInput ? { color: 'rgba(0,0,0,0)' }: {}
    return (
      <View
        style={[
          {
            flexDirection: "column",
            marginBottom: 10,
            justifyContent: "flex-start",
            alignItems: "flex-start",
          },
          style,
        ]}
      >
        <View
          style={[
            styles.inputContainer,
            style,
            errorStyle.container,
            errorContainerStyle,
          ]}
        >
          {this.before()}
          {isMaskInput ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                if (editable) {
                  this.input.focus();
                }
              }}
              style={[
                styles.mask,
                label || labelImage ? {} : styles.noLabelMask,
              ]}
            >
              <Text
                allowFontScaling={Platform.OS === "android"}
                style={[
                  styles.input,
                  isMaskInput ? styles.equalWidthfont : {},
                  inputStyle,
                  errorStyle.text,
                ]}
              >
                {hide[maskPattern](this.state.str || value)}
              </Text>
            </TouchableOpacity>
          ) : null}
          <TextInput
            style={[
              { zIndex: 2 },
              styles.input,
              inputStyle,
              errorStyle.text,
              isMaskInput ? { color: "rgba(0,0,0,0)" } : {},
              isMaskInput ? styles.equalWidthfont : {},
            ]}
            onChangeText={this.onChange}
            onFocus={onFocus}
            onEndEditing={this.onEnd}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={
              errorStyle.placeholderTextColor || placeholderTextColor
            }
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            returnKeyType={returnKeyType}
            secureTextEntry={
              !isMaskInput && secureTextEntry && this.state.isHide
            }
            autoCorrect={autoCorrect}
            underlineColorAndroid="transparent"
            editable={editable}
            onSubmitEditing={onSubmitEditing}
            ref={(ref) => (this.input = ref)}
            maxLength={maxLength}
            multiline={multiline}
            blurOnSubmit={blurOnSubmit}
            autoFocus={autoFocus}
          />
          {afterText ? (
            <Text
              style={[
                style.afterText,
                this.state.isError || this.props.isError
                  ? { color: Colors.dustyRed }
                  : null,
                { fontSize: Screen.moderateScale(16) },
                afterTextStyle,
              ]}
            >
              {afterText}{" "}
            </Text>
          ) : null}
          {secureTextEntry && showSecureBtn ? (
            <Bage
              style={{
                paddingLeft: Screen.moderateScale(9),
                paddingRight: Screen.moderateScale(9),
              }}
              text={`${this.state.isHide ? "顯示" : "隱藏"}`}
              color={Colors.coolBlue}
              onPress={() => this.setState({ isHide: !this.state.isHide })}
            />
          ) : null}
          {rightContent}
        </View>
        {(this.state.isError || this.props.isError) && errorText ? (
          <Text style={[styles.errorText, errorTextStyle]}>{errorText}</Text>
        ) : null}
      </View>
    );
  }
}
