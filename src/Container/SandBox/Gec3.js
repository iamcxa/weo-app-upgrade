import React, { Component } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Actions } from "react-native-router-flux";
import ScrollableTabView from "react-native-scrollable-tab-view";
import DefaultTabBar from "App/Components/ScrollableDefaultTabBar";
import Colors from "App/Theme/Colors";
import Gec from "./Gec";
import Gec2 from "./Gec2";
import GecList from "./GecList";
import { Title } from "../../widget/Label";
import { PrimaryBtn, LineBtn } from "../../widget/Button";
import { PrimaryInput } from "../../widget/InputBox";
import CheckBox from "../../widget/CheckBox";
import Screen from "../../utils/screen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    // padding: 30
  },
});

export default class Gec3 extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      password: "",
      checked: false,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollableTabView
          tabBarActiveTextColor={Colors.pink}
          tabBarBackgroundColor={Colors.silver}
          tabBarInactiveTextColor={Colors.mainBlue}
          renderTabBar={(props) => {
            const numberOfTabs = props.tabs.length;
            const { containerWidth } = props;
            const tabWidth = containerWidth / numberOfTabs;
            const underlineStyle = {
              width: Screen.moderateScale(20),
              backgroundColor: Colors.pink,
              marginLeft: tabWidth / 2 - Screen.moderateScale(20) / 2,
            };
            return (
              <DefaultTabBar
                style={{
                  height: Screen.moderateScale(52),
                  paddingTop: Screen.moderateScale(10),
                }}
                textStyle={{ fontSize: Screen.moderateScale(14) }}
                underlineStyle={underlineStyle}
                underlineWidth={Screen.moderateScale(20)}
              />
            );
          }}
        >
          <GecList tabLabel={JSON.stringify({ title: "未處理", notify: 0 })} />
          <Gec tabLabel={JSON.stringify({ title: "處理中", notify: 0 })} />
          <Gec2 tabLabel={JSON.stringify({ title: "已完成", notify: 0 })} />
        </ScrollableTabView>
      </View>
    );
  }
}
