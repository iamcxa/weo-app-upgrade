import React, { Component } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  View,
  Image,
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/Ionicons";

import Colors from "~/Theme/Colors";
// import NotifyBox from './NotifyBox';
import Images from "~/Theme/Images";
import Storage from "~/constant/storage";
import { Screen } from "~/Helper";
import { getItem } from "../utils/asyncStorage";

const TABS_COUNT = 5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // ...Platform.select({
    //   ios: {
    //     height: Screen.tabHeight,
    //     width: Screen.width / TABS_COUNT + Screen.onePixel,
    //   },
    //   android: {
    //     height: Screen.tabHeight,
    //     width: Screen.width / 2,
    //   },
    // }),
  },
  iconWrapper: {
    borderRadius: Screen.scale(12),
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

@connect(
  (state) => ({
    notifications: state.notification,
  }),
  (dispatch) => bindActionCreators({}, dispatch)
)
class TabIcon extends Component {
  static propTypes = {
    focused: PropTypes.bool,
    title: PropTypes.string,
    iconName: PropTypes.string,
    iconNameActive: PropTypes.string,
    iconType: PropTypes.string,
    iconStyle: PropTypes.object,
    iconSize: PropTypes.number,
    iconColor: PropTypes.string,
    tabBackColor: PropTypes.string,
    notify: PropTypes.number,
    notifications: PropTypes.object,
  };

  static defaultProps = {
    // notify: 0
    iconNameActive: undefined,
    iconStyle: {},
    iconSize: 26,
  };

  state = {
    hasNewNotify: false,
    iconType: undefined,
    iconColor: "black",
    tabBackColor: "transparent",
  };

  checkHasNewNotify = async () => {
    const lastNotifyId = await getItem(Storage.LAST_NOTIFY_ID);
    const hasNewNotify =
      lastNotifyId.length > 0 &&
      Object.keys(this.props.notifications)[0] !== lastNotifyId;
    if (this.state.hasNewNotify !== hasNewNotify) {
      this.setState({
        hasNewNotify,
      });
    }
  };

  render() {
    this.checkHasNewNotify();
    const {
      focused,
      iconType,
      iconName,
      iconNameActive = this.props.iconName,
      iconStyle,
      iconSize,
      iconColor,
      tabBackColor,
    } = this.props;
    let iconKey;
    if (iconName === "bell") {
      // eslint-disable-next-line no-nested-ternary
      iconKey = focused
        ? "bell_active"
        : this.state.hasNewNotify
        ? "bell_new"
        : "bell";
    } else {
      iconKey = focused ? `${iconName}_active` : iconName;
    }
    return (
      <View
        style={[styles.container, { backgroundColor: tabBackColor }, iconStyle]}
      >
        {Images[iconKey] ? (
          <Image source={Images[iconKey]} style={iconStyle} />
        ) : (
          <View
            style={[
              styles.iconWrapper,
              // { backgroundColor: Colors.mainYellow },
              {
                width: Screen.scale(iconSize),
                height: Screen.scale(iconSize),
              },
            ]}
          >
            <Icon
              name={focused ? iconNameActive : iconName}
              size={Screen.scale(iconSize)}
              style={{
                color: iconColor,
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </View>
        )}
      </View>
    );
  }
}

export default TabIcon;
