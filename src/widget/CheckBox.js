import React from "react";
import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  Platform,
  TouchableOpacity,
} from "react-native";
import CheckBox from "react-native-check-box";
import Colors from "../Containers/PeekTopicList/node_modules/App/Theme/Colors";
import { H4, DefaultText } from "./Label";
import { Screen } from "~/Helper";
import _ from "lodash";

const styles = StyleSheet.create({
  checkBox: {
    justifyContent: "center",
    alignItems: "center",
    width: Screen.scale(19),
    height: Screen.scale(19),
    // borderRadius: Screen.scale(2.5 * 2),
    backgroundColor: "#fafafa",
    borderStyle: "solid",
    borderWidth: Screen.onePixel,
    borderColor: "#d1d1d1",
  },
  checkBoxChecked: {
    justifyContent: "center",
    alignItems: "center",
    width: Screen.scale(19),
    height: Screen.scale(19),
    // borderRadius: Screen.scale(2.5 * 2),
    backgroundColor: Colors.pink,
    borderStyle: "solid",
    borderWidth: Screen.onePixel,
    borderColor: Colors.pink,
  },
  rightTextStyle: { fontSize: Screen.scale(12), color: Colors.subBlue },
});

export default function ({ ...props }) {
  const getText = (text) => (
    <DefaultText
      key={text}
      style={[styles.rightTextStyle, props.rightTextStyle]}
    >
      {text}
    </DefaultText>
  );
  const renderRightText = () => {
    if (_.isArray(props.rightText)) {
      return props.rightText.map((data) => {
        if (_.isString(data)) {
          return getText(data);
        }
        return data;
      });
    }
    return getText(props.rightText);
  };
  return (
    <CheckBox
      style={[props.style]}
      unCheckedImage={<View style={styles.checkBox} />}
      checkedImage={<View style={styles.checkBoxChecked} />}
      rightTextView={
        <View
          style={{
            marginLeft: Screen.scale(5),
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {renderRightText()}
          {/*{getText(props.rightText)}*/}
        </View>
      }
      {...props}
    />
  );
}
