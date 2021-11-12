import React from "react";
import { StyleSheet, Text, View } from "react-native";
import RoundButton from "~/Component/Button";
import { Colors } from "~/Theme";
import { H4 } from "./Label";
import { Screen } from "~/Helper";

const styles = StyleSheet.create({
  hr1: {
    height: Screen.scale(50),
    width: Screen.width,
    paddingLeft: Screen.scale(16),
    paddingBottom: Screen.scale(10),
    backgroundColor: Colors.white,
    justifyContent: "flex-end",
  },
});

export default function HR({ style, ...props }) {
  return (
    <View style={[styles.hr1, style]}>
      <H4
        style={[{ color: props.textColor || Colors.coolGrey }, props.textStyle]}
      >
        {props.text}
      </H4>
    </View>
  );
}
