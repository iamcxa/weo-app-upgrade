import React from "react";
import { View, StyleSheet } from "react-native";
import Colors from "~/Theme/Colors";

import { Screen } from "~/Helper";

export default function ListSeparator(props) {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    height: Screen.scale(3),
    marginTop: Screen.scale(-2),
    borderBottomWidth: Screen.scale(1),
    borderColor: Colors.silverTwo,
  },
});
