import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { Screen } from "~/Helper";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {},
});

const RectangleButton = ({
  onPress,
  backgroundColor,
  textColor,
  text,
  radius,
  height,
  width,
  style,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.container,
      {
        backgroundColor,
        borderRadius: radius,
        height,
        width,
      },
      style,
    ]}
  >
    <Text style={[styles.text, { color: textColor }]}>{text}</Text>
  </TouchableOpacity>
);

RectangleButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  radius: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  style: PropTypes.object,
};

RectangleButton.defaultProps = {
  backgroundColor: "black",
  textColor: "white",
  radius: Screen.scale(100),
  height: Screen.scale(23),
  width: Screen.scale(46),
  style: {},
};

export default RectangleButton;
