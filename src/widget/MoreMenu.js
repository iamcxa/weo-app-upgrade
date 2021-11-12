import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { Colors } from "~/Theme";
import { Screen } from "~/Helper";

const styles = StyleSheet.create({
  popupMenu: {
    backgroundColor: "white",
    marginBottom: Screen.scale(20),
    height: Screen.scale(45 * 3),
    paddingVertical: Screen.scale(12),
  },
  popupOption: {
    flex: 1,
    width: "100%",
    paddingHorizontal: Screen.scale(29),
  },
  popupLabel: {
    fontSize: Screen.scale(14),
    lineHeight: parseInt(Screen.scale(32), 10),
    color: Colors.greyishBrownTwo,
  },
});

function Option(props) {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.popupOption}>
      <Text style={styles.popupLabel}>{props.label}</Text>
    </TouchableOpacity>
  );
}

export default function MoreMenu(props) {
  return (
    <View style={styles.popupMenu}>
      {props.options.map((data) => (
        <Option {...data} key={data.label} />
      ))}
    </View>
  );
}

MoreMenu.propTypes = {
  options: PropTypes.array.isRequired,
};
