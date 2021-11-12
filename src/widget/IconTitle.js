import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { H1, H3 } from "./Label";
import { Screen } from "~/Helper";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  container: {
    flex: 0.56,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: Screen.scale(24),
    marginTop: Screen.scale(15),
  },
  subTitle: {
    paddingBottom: Screen.scale(65),
    paddingTop: Screen.scale(15),
    paddingLeft: Screen.scale(44),
    paddingRight: Screen.scale(40),
  },
});

const propTypes = {
  logo: PropTypes.any,
  title: PropTypes.string,
  logoHeight: PropTypes.number.isRequired,
  logoWidth: PropTypes.number.isRequired,
};
const defaultProps = {};

const IconTitle = (props) => (
  <View style={[styles.container, props.style]}>
    <Image
      source={props.logo}
      style={{ height: props.logoHeight, width: props.logoWidth }}
    />
    <H1 style={styles.title}>{props.title}</H1>
    <H3 style={[styles.subTitle, props.subTitleStyle]}>{props.subTitle}</H3>
  </View>
);

IconTitle.propTypes = propTypes;
IconTitle.defaultProps = defaultProps;
export default IconTitle;
