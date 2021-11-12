import React from "react";
import { View, StyleSheet } from "react-native";
import { Screen } from "~/Helper";
import { H5 } from "../widget/Label";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: Screen.scale(25),
  },
  companyName: {
    fontWeight: "600",
    color: "black",
  },
});

const FooterLogo = (props) => (
  <View style={[styles.container, props.containerStyle]} {...props}>
    <H5 style={styles.companyName}>WaiThere Inc. 2020</H5>
  </View>
);

export default FooterLogo;
