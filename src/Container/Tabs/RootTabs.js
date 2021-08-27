import React from "react";
import PropTypes from "prop-types";
import { Tabs, Scene, Stack, ActionConst } from "react-native-router-flux";

import Colors from "App/Theme/Colors";

import CustomTabIcon from "App/Components/CustomTabIcon";
import VoiceScreen from "App/Containers/Voice/VoiceScreen";
import PeekMapScreen from "App/Containers/PeekMap/PeekMapScreen";
import TopicScreenTabs from "App/Containers/Tabs/TopicScreenTabs";

const RootTabs = ({ handleUpdateList }) => (
  <Stack
    key="HomeScreen"
    hideNavBar
    type={ActionConst.REPLACE}
    panHandlers={null}
  >
    <Tabs
      key="RootTabs"
      tabBarPosition="top"
      lazy={false}
      wrap={false}
      swipeEnabled
      hideTabBar
      hideNavBar
    >
      {/* Hidden Left Tab - VoiceView */}
      <Scene
        key="voiceView"
        statusBarStyle="dark-content"
        statusBarColor={Colors.mainYellow}
        component={VoiceScreen}
      />

      {/* Tab Here You Here Circle */}
      {TopicScreenTabs({
        handleUpdateList,
      })}

      {/* Hidden Left Tab - PeekView */}
      <Scene
        key="peekMapView"
        statusBarStyle="dark-content"
        statusBarColor={Colors.pureWhite}
        component={PeekMapScreen}
      />
    </Tabs>
  </Stack>
);

RootTabs.propTypes = {
  handleUpdateList: PropTypes.func.isRequired,
};

RootTabs.defaultProps = {};

export default RootTabs;
