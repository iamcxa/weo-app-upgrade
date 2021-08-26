import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import PrivateText from "App/Components/PrivateText";
import { Title, H1, H2, H3, H4, DefaultText } from "../../widget/Label";
import { Actions } from "react-native-router-flux";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default class PrivateTextPlace extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <PrivateText>(02)123-4567</PrivateText>
        <PrivateText type="telephone">(02)123-4567</PrivateText>
        <PrivateText type="phone">09123456789</PrivateText>
        <PrivateText type="identity">A111111111</PrivateText>
        <PrivateText type="billingAddress">
          台灣台中市西區台灣大道二段2號
        </PrivateText>
        <PrivateText type="address">台灣台中市西區台灣大道二段2號</PrivateText>
        <PrivateText type="name">小明</PrivateText>
        <Title type="name">Title</Title>
        <H1 type="name">H1</H1>
        <H2 type="name">H2</H2>
        <H3 type="name">H3</H3>
        <H4 type="name">H4</H4>
      </View>
    );
  }
}
