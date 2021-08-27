import React, { Component } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { Actions } from "react-native-router-flux";
import Storage from "App/constant/storage";
import Images from "App/Theme/Images";
import IconTitle from "../widget/IconTitle";
import { PrimaryBtn } from "../widget/Button";
import { Title } from "../widget/Label";
import Screen from "../utils/screen";
import { removeItem, getItem } from "../utils/asyncStorage";
import i18n, { i18nKey } from "../utils/i18n";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    marginTop: 22,
  },
});

export default class ForgetPassword extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      identity: "",
      invalid: {},
    };
    this.iosKeyboardHeight = new Animated.Value(0);
  }

  render() {
    return (
      <View style={styles.container}>
        <IconTitle
          title={i18n.t(i18nKey.systemLogoutTitle)}
          logo={Images.logo}
          subTitle={`${this.props.message || "請再次登入 APP"}`}
          logoHeight={85}
          logoWidth={85}
        />
        <View style={{ flex: 0.43 }}>
          <PrimaryBtn
            onPress={async () => {
              await removeItem(Storage.AUTHORIZATION);
              Actions.auth();
            }}
            text={i18n.t(i18nKey.systemLogoutAction)}
          />
        </View>
      </View>
    );
  }
}
