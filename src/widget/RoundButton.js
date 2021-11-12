import React from "react";
import { StyleSheet } from "react-native";
import RoundButton from "~/Component/Button";
import { Colors } from "~/Theme";
import { Screen } from "~/Helper";

const styles = StyleSheet.create({
  primary: {
    borderRadius: Screen.scale(25),
    maxWidth: Screen.width - Screen.scale(32),
    minHeight: Screen.scale(50),
  },
  sub: {
    borderRadius: Screen.scale(20),
    maxWidth: Screen.width - Screen.scale(32),
  },
  select: {
    borderRadius: Screen.scale(20),
    marginRight: Screen.scale(10),
    minWidth: 100,
    height: Screen.scale(30),
    marginBottom: Screen.scale(10),
  },
  selectRect: {
    borderRadius: Screen.scale(20),
    minWidth: 100,
    height: Screen.scale(30),
    marginBottom: Screen.scale(10),
  },
  small: {
    borderRadius: Screen.scale(20),
    minWidth: 100,
    height: Screen.scale(30),
  },
  badge: {
    justifyContent: "center",
    alignItems: "center",
  },
  bage: {
    borderRadius: Screen.scale(20),
    height: Screen.scale(20),
    marginBottom: Screen.scale(3),
  },
  detail: {
    // borderRadius: Screen.scale(20),
    height: Screen.scale(35),
    maxWidth: Screen.width - Screen.scale(32),
    borderRadius: 0,
    paddingTop: Screen.scale(9),
    paddingBottom: Screen.scale(8),
    justifyContent: "center",
  },
});

export function PrimaryBtn({ style, ...props }) {
  return (
    <RoundButton
      style={[styles.primary, style]}
      btnColor={Colors.black}
      textColor={Colors.whiteThree}
      textStyle={{
        fontSize: Screen.scale(20),
        fontWeight: "900",
      }}
      {...props}
    />
  );
}
export function DetailBtn({ style, ...props }) {
  return (
    <RoundButton
      style={[styles.detail, style]}
      btnColor={Colors.whiteThree}
      textColor={Colors.purpleyGrey}
      borderColor="#979797"
      {...props}
    />
  );
}
export function SubBtn({ style, ...props }) {
  return (
    <RoundButton
      style={[styles.sub, style]}
      btnColor={Colors.whiteThree}
      textColor={Colors.turquoise}
      borderColor={Colors.turquoise}
      textStyle={{ fontSize: Screen.scale(18) }}
      {...props}
    />
  );
}

export function SelectBtn({ style, ...props }) {
  let selectColor = {};
  if (props.onSelect) {
    selectColor = {
      textColor: Colors.whiteThree,
      btnColor: Colors.darkSkyBlue,
      borderColor: Colors.darkSkyBlue,
    };
  } else {
    selectColor = {
      btnColor: Colors.whiteThree,
      textColor: Colors.purpleyGrey,
      borderColor: Colors.coolGrey,
    };
  }
  return (
    <RoundButton
      style={[styles.select, style]}
      textStyle={{ fontSize: Screen.scale(16) }}
      {...selectColor}
      {...props}
    />
  );
}

export function SelectRectBtn({ style, ...props }) {
  let selectColor = {};
  if (props.onSelect) {
    selectColor = {
      textColor: Colors.whiteThree,
      btnColor: Colors.tealish,
      borderColor: Colors.tealish,
    };
  } else {
    selectColor = {
      btnColor: Colors.whiteThree,
      textColor: Colors.tealish,
      borderColor: Colors.tealish,
    };
  }
  return (
    <RoundButton
      style={[
        styles.selectRect,
        {
          borderRadius: 0,
          margin: 0,
        },
        props.borderRight ? {} : { borderRightWidth: 0 },
        style,
      ]}
      textStyle={{ fontSize: Screen.scale(7 * 2) }}
      {...selectColor}
      {...props}
    />
  );
}

export function SmallBtn({ style, ...props }) {
  return (
    <RoundButton
      style={[styles.small, style]}
      textStyle={{ fontSize: Screen.scale(16) }}
      btnColor={Colors.purpleyGrey}
      textColor={Colors.whiteThree}
      borderColor={Colors.purpleyGrey}
      {...props}
    />
  );
}

export function Badge({
  radius = Screen.scale(100),
  height = Screen.scale(23),
  width = Screen.scale(56),
  backgroundColor = "black",
  textColor = "white",
  style,
  ...props
}) {
  return (
    <RoundButton
      style={[
        styles.badge,
        {
          backgroundColor,
          borderRadius: radius,
          height,
          width,
        },
        style,
      ]}
      textStyle={{
        fontSize: Screen.scale(14),
        fontWeight: "500",
      }}
      textColor={textColor}
      onPress={props.onPress}
      {...props}
    />
  );
}

export function Bage({ style, ...props }) {
  return (
    <RoundButton
      style={[styles.bage, style]}
      textStyle={{ fontSize: Screen.scale(14), fontWeight: "500" }}
      btnColor={Colors.whiteThree}
      textColor={props.color}
      borderColor={props.color}
      onPress={props.onPress}
      {...props}
    />
  );
}
