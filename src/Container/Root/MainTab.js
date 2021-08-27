import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Colors, Classes } from '~/Theme';
import { Screen, ScaledSheet } from '~/Helpers';

import { onUpdateList } from '~/Stores/List/Actions/list';
import TopicScreen from '~/Containers/Topic/TopicScreen';
import ThereYouAreIntro from '~/Containers/ThereYouAreIntro';
import ProfileScreen from '~/Containers/Profile/ProfileScreen';
import TopicCreationScreen from '~/Containers/Topic/TopicCreationScreen';
import MainTabBar from '~/Components/MainTabBar';
import CustomTabIcon from '~/Components/CustomTabIcon';

const styles = ScaledSheet.create({
  tabBar: {
    alignItems: 'stretch',
    // justifyContent: 'space-between',
    width: '100%',
    height: Screen.moderateScale(49),
    backgroundColor: '#ffffff',
    shadowColor: '#d4d4d47f',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: Screen.moderateScale(17),
    shadowOpacity: 1,
  },
});

const HereYourTopicList = (props) => (
  <TopicScreen
    // key="hereYouAre"
    // icon={CustomTabIcon}
    iconName="navHereYouAre"
    iconNameActive="navHereYouAre_active"
    statusBarColor={Colors.paleGrey}
    belongsTo="HERE_YOU_ARE"
    key="hereYouAre_topicList"
    sceneKey="hereYouAre_topicList"
  />
);

const ThereYouAreTopicList = (props) => (
  <TopicScreen
    // key="thereYouAre"
    // icon={CustomTabIcon}
    iconName="navThereYouAre"
    iconNameActive="navThereYouAre_active"
    statusBarColor={Colors.paleGrey}
    belongsTo="THERE_YOU_ARE"
  />
);

class MainTab extends React.Component {
  state = {
    index: 0,
    routes: [
      {
        key: 'HereYourTopicList',
        title: 'Here',
        iconName: 'navHereYouAre',
        iconNameActive: 'navHereYouAre_active',
      },
      {
        key: 'ThereYouAreTopicList',
        title: 'There',
        iconName: 'navThereYouAre',
        iconNameActive: 'navThereYouAre_active',
      },
      {
        key: 'ProfileScreen',
        title: 'Profile',
        iconName: 'navAccount',
        iconNameActive: 'navAccountActive',
      },
      {
        key: 'CreateTopic',
        title: 'Create',
        iconName: 'navAdd',
        iconStyle: {
          top: -10,
          height: Screen.moderateScale(48),
          width: Screen.moderateScale(48),
          zIndex: 100000,
        },
      },
    ],
  };

  render() {
    const { handleUpdateList } = this.props;
    return (
      <SafeAreaView style={Classes.fill}>
        <TabView
          swipeEnabled={false}
          animationEnabled={false}
          lazy={false}
          navigationState={this.state}
          renderScene={SceneMap({
            HereYourTopicList,
            ThereYouAreTopicList,
            ProfileScreen,
            CreateTopic: TopicCreationScreen,
          })}
          onIndexChange={(index) => this.setState({ index })}
          tabBarPosition="bottom"
          renderTabBar={(props) => (
            <TabBar
              {...props}
              showLabel={false}
              style={styles.tabBar}
              renderIcon={({ route, focused, color }) => (
                <CustomTabIcon route={route} focused={focused} color={color} />
              )}
              // indicatorStyle={{ backgroundColor: 'white' }}
              onTabPress={({ route, preventDefault }) => {
                if (route.key === 'CreateTopic') {
                  preventDefault();
                  return Actions.createNewTopic();
                }
                if (route.key === 'HereYourTopicList' || route.key === 'ThereYouAreTopicList') {
                  handleUpdateList({
                    isBackToTop: true,
                  });
                }
              }}
            />
          )}
          initialLayout={{
            width: Screen.width,
            height: Screen.height,
          }}
        />
      </SafeAreaView>
    );
  }
}

export default connect(
  (state, props) => ({
    tabIndex: state.appState.mainTabIndex,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        handleUpdateList: onUpdateList,
      },
      dispatch,
    ),
)(MainTab);
