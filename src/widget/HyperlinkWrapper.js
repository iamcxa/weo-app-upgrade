import React, { Component } from "react";
import { StyleSheet } from "react-native";
import Hyperlink from "react-native-hyperlink";

const styles = StyleSheet.create({
  linkStyle: {
    color: "#40c4ff",
  },
});

export default class HyperlinkWrapper extends Component {
  render() {
    return (
      <Hyperlink linkDefault linkStyle={styles.linkStyle}>
        {this.props.children}
      </Hyperlink>
    );
  }
}
