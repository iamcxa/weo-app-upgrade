import React from "react";
import {
  Text,
  StatusBar,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import PropTypes from "prop-types";
import moment from "moment";
import numeral from "numeral";
import Icon from "react-native-vector-icons/Ionicons";
import { isEqual, isEmpty } from "lodash";

import { Colors } from "~/Theme";

import { Screen } from "~/Helper";
import { getRoutePrefix } from "../utils/route";
import Config from "~/Config";
import { translate as t } from "~/Helper/I18n";
import { Dialog } from "App/Helpers";
import { CircleActions } from "App/Stores";

const { STAY_CIRCLE_TIME, LEFT_APP_TIMEOUT } = Config;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: Platform.select({
      ios: Screen.scale(30),
      android: Screen.scale(10),
    }),
    paddingBottom: Screen.scale(10),
    // width: '100%',
    width: Screen.width,
    backgroundColor: Colors.mainYellow,
    justifyContent: "center",
    alignItems: "center",
    height: Screen.scale(60),
    // position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    zIndex: 100,
  },
  message: {
    fontSize: Screen.scale(14),
    fontWeight: "500",
    lineHeight: parseInt(Screen.scale(20), 10),
    textAlign: "center",
    color: Colors.black,
  },
  icon: {
    marginRight: Screen.scale(10),
  },
});

class LeftCircleAlert extends React.PureComponent {
  static propTypes = {
    routeName: PropTypes.string.isRequired,
    updateUserCircle: PropTypes.func.isRequired,
    updateLeftCircleTime: PropTypes.func.isRequired,
    fetchGetStayCircles: PropTypes.func.isRequired,

    leftCircleTime: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    leftAppTime: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    userCircle: PropTypes.object,
    currentCircle: PropTypes.object,
  };

  static defaultProps = {
    leftCircleTime: null,
    leftAppTime: null,
    userCircle: null,
    currentCircle: null,
  };

  state = {
    remainingTime: STAY_CIRCLE_TIME,
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      leftCircleTime,
      // routeName,
      userCircle,
      currentCircle,
      // fetchGetStayCircles,
      updateLeftCircleTime,
      leftAppTime,
    } = this.props;
    const remainingTime = moment(leftCircleTime * 1000).diff(
      moment(),
      "seconds"
    );
    if (
      userCircle &&
      currentCircle &&
      userCircle.name !== currentCircle.name &&
      leftAppTime < moment(leftCircleTime).add(LEFT_APP_TIMEOUT, "hours")
    ) {
      if (leftCircleTime === null) {
        // 這個狀態代表剛進入不同Circle
        const message =
          "try to force update user current circle cuz user is just start the app";
        console.log(message);
        this.updateCurrentCircle();
        if (this.timer) {
          this.clearTimer();
        }
        this.startTimer();
      } else if (remainingTime > 0) {
        // remainingTime > 0，代表還在15分鐘內
        if (this.timer) {
          this.clearTimer();
        }
        this.startTimer();
      } else if (remainingTime < 0) {
        // remainingTime < 0 代表超過15分鐘
        if (this.timer) {
          this.clearTimer();
        }
        updateLeftCircleTime(null);
      }
    } else {
      updateLeftCircleTime(null);
      if (this.timer) {
        this.clearTimer();
      }
    }
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  onPress = () => {
    const { userCircle, currentCircle } = this.props;
    Dialog.leaveCircleAlert({
      onYesPress: () => {
        // StatusBar.setBackgroundColor(statusBarColor);
        // 有順序性
        this.clearTimer();
        this.updateCurrentCircle();
      },
      oldCircleName: userCircle.name,
      newCircleName: currentCircle.name,
    });
  };

  updateCurrentCircle = () => {
    const {
      updateUserCircle,
      updateLeftCircleTime,
      // fetchGetStayCircles,
      currentCircle,
    } = this.props;
    // TODO 應該可以直接改
    updateUserCircle(currentCircle);
    updateLeftCircleTime(null);
    // fetchGetStayCircles();
  };

  startTimer = () => {
    this.timer = setInterval(() => {
      const {
        routeName,
        currentCircle,
        leftCircleTime,
        updateUserCircle,
        updateLeftCircleTime,
      } = this.props;
      const remainingTime = moment(leftCircleTime * 1000).diff(
        moment(),
        "seconds"
      );
      if (leftCircleTime !== null && remainingTime >= 0) {
        // 更新倒數時間
        this.setState({ remainingTime });
      } else {
        // 倒數結束
        this.clearTimer();
        this.setState({ remainingTime: 0 });
        updateUserCircle(currentCircle);
        updateLeftCircleTime(null);
        if (
          getRoutePrefix(routeName) === "hereYouAre" &&
          routeName !== "hereYouAre_topicList"
        ) {
          Actions.popTo("hereYouAre_topicList", {});
        }
      }
    }, 500);
  };

  clearTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
  };

  render() {
    const { remainingTime } = this.state;
    const { leftCircleTime } = this.props;
    // const minutes = remainingTime / 60;
    // const seconds = (remainingTime % 60).toFixed(2);
    const displayRemainingTime = numeral(remainingTime)
      .format("00:00:00")
      .slice(2);
    return (
      leftCircleTime && (
        <TouchableOpacity style={styles.container} onPress={this.onPress}>
          <Icon
            name="md-time"
            size={16}
            color={Colors.black}
            style={styles.icon}
          />
          <Text style={styles.message}>
            {`${t("__alert_leave_circle_message")} ${displayRemainingTime}`}
          </Text>
        </TouchableOpacity>
      )
    );
  }
}

export default connect(
  (state) => ({
    routeName: state.appRoute.routeName,

    leftCircleTime: state.circle.leftCircleTime,
    leftAppTime: state.circle.leftAppTime,
    userCircle: state.circle.userCircle,
    currentCircle: state.circle.currentCircle,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        updateLeftCircleTime: CircleActions.updateLeftCircleTime,
        updateUserCircle: CircleActions.updateUserCircle,
        fetchGetStayCircles: CircleActions.fetchGetStayCircles,
      },
      dispatch
    )
)(LeftCircleAlert);
