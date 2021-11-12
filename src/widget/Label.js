import React from "react";
import { StyleSheet, Text, View, PixelRatio, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import _ from "lodash";
import { Colors } from "~/Theme";

import { Screen } from "~/Helper";

const fixOPPO = () => {
  let fixObj = {};
  if (DeviceInfo.getBrand() === "OPPO") {
    fixObj = {
      fontFamily: "lucida grande",
    };
  }
  return fixObj;
};

const styles = StyleSheet.create({
  title: {
    fontSize: Screen.scale(24),
    ...fixOPPO(),
  },
  default: {
    ...fixOPPO(),
  },
  h1: {
    fontSize: Screen.scale(20),
    ...fixOPPO(),
  },
  h2: {
    fontSize: Screen.scale(18),
    ...fixOPPO(),
  },
  h3: {
    fontSize: Screen.scale(16),
    ...fixOPPO(),
  },
  h4: {
    fontSize: Screen.scale(14),
    ...fixOPPO(),
  },
  h5: {
    fontSize: Screen.scale(12),
    ...fixOPPO(),
  },
  unit: {
    lineHeight: parseInt(Screen.scale(14 * 2), 10),
    fontSize: Screen.scale(14),
    fontWeight: "500",
    marginRight: Screen.scale(2.5 * 2),
    ...Platform.select({
      ios: {
        paddingTop: Screen.scale(6),
      },
    }),
    ...fixOPPO(),
  },
  value: {
    fontSize: Screen.scale(24),
    lineHeight: parseInt(Screen.scale(16 * 2), 10),
    fontWeight: "500",
    marginRight: Screen.scale(2.5 * 2),
    textAlign: "right",
    // textAlign: 'right'
  },
});

export function DefaultText({ style, ...props }) {
  return (
    <Text style={[styles.default, style]} allowFontScaling={false} {...props} />
  );
}

export function Title({ style, ...props }) {
  return (
    <Text style={[styles.title, style]} allowFontScaling={false} {...props} />
  );
}

export function H1({ style, ...props }) {
  return (
    <Text style={[styles.h1, style]} allowFontScaling={false} {...props} />
  );
}

export function H2({ style, ...props }) {
  return (
    <Text style={[styles.h2, style]} allowFontScaling={false} {...props} />
  );
}

export function H3({ style, ...props }) {
  return (
    <Text style={[styles.h3, style]} allowFontScaling={false} {...props} />
  );
}

export function H4({ style, ...props }) {
  return (
    <Text style={[styles.h4, style]} allowFontScaling={false} {...props} />
  );
}

export function H5({ style, ...props }) {
  return (
    <Text style={[styles.h5, style]} allowFontScaling={false} {...props} />
  );
}

export function UnitLabel({ style, ...props }) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "flex-start",
          //height: parseInt(Screen.scale(14 * 2), 10),
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.value,
          props.valueStyle,
          { color: props.valueColor || props.textColor },
        ]}
      >
        {props.value}
      </Text>
      <Text
        style={[
          styles.unit,
          props.unitStyle,
          { color: props.unitColor || props.textColor },
        ]}
      >
        {props.unit}
      </Text>
    </View>
  );
}
