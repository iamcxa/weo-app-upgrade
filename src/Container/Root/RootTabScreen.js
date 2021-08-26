import * as React from "react";
import { TabView, SceneMap } from "react-native-tab-view";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Screen } from "App/Helpers";
import AppStateActions from "App/Stores/AppState/Actions";
import VoiceScreen from "App/Containers/Voice/VoiceScreen";
import PeekMapScreen from "App/Containers/PeekMap/PeekMapScreen";

import { onUpdateList } from "App/Stores/List/Actions/list";

import MainTab from "./MainTab";

class RootTab extends React.Component {
  state = {
    index: 0,
    routes: [
      {
        key: "VoiceScreen",
        title: "VoiceScreen",
        belongsTo: "THERE_YOU_ARE",
      },
      { key: "MainTab", title: "MainTab", belongsTo: "THERE_YOU_ARE" },
      {
        key: "PeekMapScreen",
        title: "PeekMapScreen",
        belongsTo: "THERE_YOU_ARE",
      },
    ],
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.tabIndex !== this.state.index) {
      this.onIndexChang(this.props.tabIndex);
    }
  }

  onIndexChang = () => {
    this.setState({
      index: this.props.tabIndex,
    });
  };

  render() {
    const { onIndexChange } = this.props;
    return (
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          VoiceScreen,
          MainTab,
          PeekMapScreen,
        })}
        onIndexChange={(i) => onIndexChange(i)}
        renderTabBar={() => null}
        initialLayout={{
          width: Screen.width,
          height: Screen.height,
        }}
      />
    );
  }
}

export default connect(
  (state, props) => ({
    tabIndex: state.appState.rootTabIndex,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        onIndexChange: AppStateActions.onRootTabIndexChange,
        handleUpdateList: onUpdateList,
      },
      dispatch
    )
)(RootTab);
