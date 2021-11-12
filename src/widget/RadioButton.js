import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import { Screen } from "~/Helper";
import { Colors } from "~/Theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  circleOutline: {
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {},
  label: {
    marginLeft: Screen.scale(12),
    fontSize: Screen.scale(14),
    lineHeight: parseInt(Screen.scale(33), 10),
    color: Colors.greyishBrownTwo,
  },
});

export default function RadioButton(props) {
  const circleOutlineStyle = {
    borderRadius: props.circleSize / 2,
    width: props.circleSize,
    height: props.circleSize,
    borderColor: props.circleOutlineColor,
    borderWidth: props.outlineWidth,
  };
  const circleStyle = {
    borderRadius: (props.circleSize - 8) / 2,
    width: props.circleSize - 8,
    height: props.circleSize - 8,
    backgroundColor: props.circleColor,
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        props.onPress(props.label);
      }}
    >
      <View style={[styles.circleOutline, circleOutlineStyle]}>
        <View style={[props.active && circleStyle]} />
      </View>
      <Text style={styles.label}>{props.label}</Text>
    </TouchableOpacity>
  );
}

RadioButton.propTypes = {
  circleOutlineColor: PropTypes.string,
  circleColor: PropTypes.string,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  circleSize: PropTypes.number,
  onPress: PropTypes.func.isRequired,
};

RadioButton.defaultProps = {
  circleOutlineColor: Colors.silverThree,
  outlineWidth: Screen.scale(3),
  circleColor: Colors.mainYellow,
  active: false,
  circleSize: Screen.scale(20),
};
