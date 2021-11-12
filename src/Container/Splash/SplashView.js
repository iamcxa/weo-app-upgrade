import React from "react";
import { StatusBar, View, StyleSheet, Image } from "react-native";

import { Screen } from "~/Helper";
import { Images, Colors } from "~/Theme";
import { FooterLogo } from "~/Component";

const SplashView = (props) => (
  <View style={styles.container}>
    <StatusBar backgroundColor={Colors.mainYellow} />
    <Image source={Images.splashBackground} style={styles.backgroundImage} />
    <Image source={Images.splashLogo} />
    <FooterLogo style={styles.footerLogo} />
  </View>
);

const styles = StyleSheet.create({
  backgroundImage: {
    height: "100%",
    position: "absolute",
    width: "100%",
  },
  container: {
    alignItems: "center",
    backgroundColor: Colors.mainYellow,
    flex: 1,
    justifyContent: "center",
  },
  footerLogo: {
    bottom: Screen.scale(25),
    position: "absolute",
  },
});

export default SplashView;
