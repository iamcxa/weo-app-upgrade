import React, { Component } from "react";
import PropTypes from "prop-types";
import { Text, TouchableOpacity } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default class IconButton extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    style: PropTypes.any,
    iconName: PropTypes.string,
    iconType: PropTypes.string,
    iconSize: PropTypes.number,
    iconColor: PropTypes.string,
    iconParams: PropTypes.any,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    onPress: () => {},
    disabled: false,
    style: {},
    iconName: "",
    iconType: "",
    iconSize: 24,
    iconColor: "black",
    iconParams: {},
    width: 48,
    height: 48,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.btnClick = false;
  }

  handleOnPress = () => {
    const { onPress, disabled } = this.props;
    if (!disabled) {
      if (!this.btnClick) {
        this.btnClick = true;
        if (onPress) {
          onPress();
        }
        setTimeout(() => {
          this.btnClick = false;
        }, 200);
      }
    }
  };

  render() {
    const {
      style,
      iconName,
      iconType,
      iconSize = 23,
      iconColor,
      iconParams,
      width = 48,
      height = 48,

      disabled,
    } = this.props;
    const getIcon = () => {
      switch (iconType) {
        case "Ionicons": {
          return (
            <Ionicons
              name={iconName}
              size={iconSize}
              color={iconColor}
              {...iconParams}
            />
          );
        }
        case "MaterialIcons": {
          return (
            <MaterialIcons
              name={iconName}
              size={iconSize}
              color={iconColor}
              {...iconParams}
            />
          );
        }
        case "FontAwesome": {
          return (
            <FontAwesome
              name={iconName}
              size={iconSize}
              color={iconColor}
              {...iconParams}
            />
          );
        }
        case "FontAwesome5": {
          return (
            <FontAwesome5
              name={iconName}
              size={iconSize}
              color={iconColor}
              {...iconParams}
            />
          );
        }
        default:
          return <Text>{iconName}</Text>;
      }
    };
    return (
      <TouchableOpacity
        style={[
          {
            justifyContent: "center",
            alignItems: "center",
            height,
            width,
            // backgroundColor: 'blue',
          },
          style,
        ]}
        onPress={this.handleOnPress}
        activeOpacity={disabled ? 1 : 0.2}
      >
        {getIcon()}
      </TouchableOpacity>
    );
  }
}
