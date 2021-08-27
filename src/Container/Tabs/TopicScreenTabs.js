import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Tabs, Scene, Stack, Actions, ActionConst } from 'react-native-router-flux';

import { store } from '~/App';
import { Colors, Metrics } from '~/Theme';
import { Dialog, Screen } from '~/Helpers';
import { CustomTabIcon } from '~/Components';

import FaqScreen from '~/Containers/FaqScreen';
import PrivacyScreen from '~/Containers/PrivacyScreen';
import ThereYouAreIntro from '~/Containers/ThereYouAreIntro';
import ProfileScreen from '~/Containers/Profile/ProfileScreen';
import SignUpScreen from '~/Containers/Authorize/SignUpScreen';
import NotifySettingScreen from '~/Containers/NotifySettingScreen';
import TopicCreationScreen from '~/Containers/Topic/TopicCreationScreen';
import NotificationScreen from '~/Containers/Notification/NotificationScreen';
import HereYouAreTopicScreen from '~/Containers/Topic/HereYouAreTopicScreen';
import ThereYouAreTopicScreen from '~/Containers/Topic/ThereYouAreTopicScreen';
import PanHandlers from './PanHandlers';

const styles = StyleSheet.create({
  floatingButton: {
    height: Screen.scale(64),
    width: Screen.scale(64),
    top: -10,
    zIndex: 100000,
  },
  tabBarStyle: {
    alignItems: 'stretch',
    backgroundColor: Colors.white,
    height: Screen.scale(64),
    shadowColor: Colors.steel10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: Screen.scale(17),
    width: '100%',
  },
});

const TAB_CREATE_TOPIC_KEY = 'tab_create';

const tabOnPress =
  (handleUpdateList) =>
  ({ navigation: { state: { key } = {} } = {} }) => {
    // detect if the list needs to backing to the top
    if (key.includes('thereYouAre') || key.includes('hereYouAre')) {
      handleUpdateList({
        isBackToTop: true,
      });
    }

    // 如果點了 thereYouAre 頁面，但尚未設定
    const {
      circle: { homeCircle = {} },
    } = store.getState();
    // console.log('storageSetThereYouAre=>', storageSetThereYouAre);
    if (key.includes('thereYouAre') && (!homeCircle || !homeCircle.id)) {
      return Actions.thereYouAre_intro();
    }

    // detect if the user is clicked create topic tab.
    if (key === TAB_CREATE_TOPIC_KEY) {
      // 如果不在任何 circle，跳出警示
      const {
        circle: { userCircle = {} },
        appRoute: { routeName, prevRoute },
      } = store.getState();
      // console.log('userCircle=>', userCircle);
      // console.log('prevRoute=>', prevRoute);
      // console.log('routeName=>', routeName);
      if ((!userCircle || !userCircle.id) && !routeName.includes('thereYouAre')) {
        return Dialog.noCircleAlert();
      }

      // return Actions.createNewTopic({
      //   type: 'jump',
      //   belongsTo: routeName.includes('thereYouAre') ? 'THERE_YOU_ARE' : 'HERE_YOU_ARE',
      // });
      return Actions.jump('createNewTopic', {
        type: 'jump',
        belongsTo: routeName.includes('thereYouAre') ? 'THERE_YOU_ARE' : 'HERE_YOU_ARE',
      });
    }
    return Actions.jump(key, { swipeEnabled: false });
  };

const TopicScreenTabs = ({ handleUpdateList }) => (
  <Stack hideNavBar key="TopicScreenStack" statusBarColor={Colors.paleGrey}>
    <Tabs
      key="TopicScreenTabs"
      lazy={false}
      wrap={false}
      showLabel={false}
      statusBarColor={Colors.paleGrey}
      tabBarPosition="bottom"
      // tabBarComponent={MainTabBar}
      tabBarStyle={styles.tabBarStyle}
      tabBarOnPress={tabOnPress(handleUpdateList)}
      tabBarOnLongPress={tabOnPress(handleUpdateList)}
      hideNavBar
    >
      <Stack
        key="hereYouAre"
        icon={CustomTabIcon}
        iconName="navHereYouAre"
        iconNameActive="navHereYouAre_active"
        statusBarColor={Colors.paleGrey}
        statusBarStyle="dark-content"
        wrap={false}
        hideNavBar
      >
        <Scene
          drawer
          key="hereYouAre_topicList"
          sceneKey="hereYouAre_topicList"
          component={HereYouAreTopicScreen}
          belongsTo="HERE_YOU_ARE"
          statusBarColor={Colors.paleGrey}
        />
      </Stack>

      {/* Tab Fav Circle */}
      <Stack
        key="thereYouAre"
        icon={CustomTabIcon}
        iconName="navThereYouAre"
        iconNameActive="navThereYouAre_active"
        statusBarColor={Colors.paleGrey}
        statusBarStyle="dark-content"
        swipeEnabled={false}
        wrap={false}
        hideNavBar
      >
        <Scene
          key="thereYouAre_topicList"
          component={ThereYouAreTopicScreen}
          statusBarColor={Colors.paleGrey}
          swipeEnabled={false}
          belongsTo="THERE_YOU_ARE"
        />
        <Scene
          key="thereYouAre_intro"
          component={ThereYouAreIntro}
          statusBarColor={Colors.paleGrey}
          type={ActionConst.REPLACE}
          panHandlers={null}
          hideNavBar
          hideTabBar
          modal
        />
      </Stack>

      {/* Tab Notification */}
      <Stack
        key="tab_notify"
        title="Notify"
        icon={CustomTabIcon}
        iconName="bell"
        statusBarColor={Colors.whiteThree}
        statusBarStyle="dark-content"
      >
        <Scene
          key="notify_list"
          component={NotificationScreen}
          statusBarColor={Colors.whiteThree}
          statusBarStyle="dark-content"
          tabBarComponent={() => null}
          swipeEnabled={false}
          hideNavBar
        />
      </Stack>

      {/* Tab Profile */}
      <Stack
        key="tab_profile"
        title="Profile"
        icon={CustomTabIcon}
        iconName="navAccount"
        iconNameActive="navAccountActive"
        statusBarColor={Colors.whiteThree}
        statusBarStyle="dark-content"
        tabBarComponent={() => null}
        swipeEnabled={false}
        hideNavBar
        hideTabBar
      >
        <Scene
          key="profile_view"
          component={ProfileScreen}
          statusBarColor={Colors.whiteThree}
          statusBarStyle="dark-content"
          modal
        />
        <Scene
          key="faq"
          component={FaqScreen}
          statusBarColor="white"
          panHandlers={Actions.profile_view}
          hideNavBar
          hideTabBar
        />
        <Scene
          key="notifySetting"
          statusBarColor="white"
          component={NotifySettingScreen}
          panHandlers={Actions.profile_view}
          hideNavBar
          hideTabBar
        />
        <Scene
          key="privacy_view"
          component={PrivacyScreen}
          backTo="profile_view"
          panHandlers={Actions.profile_view}
          hideNavBar
          hideTabBar
          showBack
          showButton={false}
        />
      </Stack>

      {/* Tab Create Topic */}
      <Scene
        key="tab_create"
        title="Create"
        icon={CustomTabIcon}
        iconColor={Colors.black}
        iconName="navAdd"
        iconStyle={styles.floatingButton}
        statusBarColor={Colors.whiteThree}
        statusBarStyle="dark-content"
        component={TopicCreationScreen}
        tabBarComponent={() => null}
        swipeEnabled={false}
        hideNavBar
        hideTabBar
        modal
      />
    </Tabs>
  </Stack>
);

TopicScreenTabs.propTypes = {
  handleUpdateList: PropTypes.func.isRequired,
};

export default TopicScreenTabs;
