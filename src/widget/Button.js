import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import RoundButton from "~/Component/Button";
import { Colors } from "~/Theme";
import { Screen } from "~/Helper";
import Images from "~/Theme/Images";

const styles = StyleSheet.create({
  primary: {
    // borderRadius: Screen.scale(20),
    maxWidth: Screen.width - Screen.scale(32),
    height: Screen.scale(50),
    width: Screen.scale(115),
  },
  sub: {
    maxWidth: Screen.width - Screen.scale(32),
    height: Screen.scale(50),
    width: Screen.scale(115),
  },
});

export function PrimaryBtn({ style, ...props }) {
  return (
    <RoundButton
      style={[styles.primary, style]}
      btnColor={props.disablePress ? Colors.silver : Colors.mainBlue}
      textColor={Colors.whiteThree}
      textStyle={{ fontSize: Screen.scale(16) }}
      {...props}
    />
  );
}

export function SubBtn({ style, ...props }) {
  return (
    <RoundButton
      style={[styles.sub, style]}
      btnColor={Colors.whiteThree}
      textColor={props.disablePress ? Colors.silver : Colors.mainBlue}
      borderColor={props.disablePress ? Colors.silver : Colors.mainBlue}
      textStyle={{ fontSize: Screen.scale(18) }}
      {...props}
    />
  );
}

export function LineBtn({ style, ...props }) {
  return (
    <TouchableOpacity
      hitSlop={{
        top: 30,
        left: 5,
        bottom: 30,
        right: 5,
      }}
      style={{
        borderBottomColor: Colors.mainBlue,
        borderBottomWidth: Screen.onePixel * 2,
      }}
      onPress={props.onPress}
    >
      <Text style={{ fontSize: Screen.scale(12), color: Colors.subBlue }}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}

export function LogoBtn({ style, ...props }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Image
        style={{ width: Screen.scale(150), height: Screen.scale(50) }}
        resizeMode="contain"
        source={Images.big_logo}
      />
      <RoundButton
        style={[styles.primary, style]}
        btnColor={props.disablePress ? Colors.silver : Colors.mainBlue}
        textColor={Colors.whiteThree}
        textStyle={{ fontSize: Screen.scale(16) }}
        {...props}
      />
    </View>
  );
}

export function SelectBtn({ style, ...props }) {
  let selectColor = {};
  if (props.onSelect) {
    selectColor = {
      textColor: Colors.whiteThree,
      btnColor: Colors.mainBlue,
      borderColor: Colors.mainBlue,
    };
  } else {
    selectColor = {
      btnColor: Colors.silver,
      textColor: Colors.whiteThree,
      borderColor: Colors.silver,
    };
  }
  return (
    <RoundButton
      style={[styles.primary, style]}
      textStyle={{ fontSize: Screen.scale(16) }}
      {...selectColor}
      {...props}
    />
  );
}
