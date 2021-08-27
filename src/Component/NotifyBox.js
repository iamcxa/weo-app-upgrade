import React, { Component } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Animated, View, Text } from "react-native";
import Screen from "../utils/screen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
  },
  notify: {
    position: "absolute",
    backgroundColor: "red",
    height: Screen.moderateScale(22),
    borderRadius: Screen.moderateScale(11),
    paddingTop: Screen.moderateScale(1),
    paddingLeft: Screen.moderateScale(4),
    paddingRight: Screen.moderateScale(4),
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  small: {
    position: "absolute",
    backgroundColor: "red",
    height: Screen.moderateScale(10),
    width: Screen.moderateScale(10),
    borderRadius: Screen.moderateScale(5),
    padding: 1,
  },
  amount: {
    flex: 1,
    color: "#fff",
    fontSize: Screen.moderateScale(14),
    backgroundColor: "rgba(0, 0, 0, 0)",
    fontFamily: "Verdana",
  },
});

export default class NotifyBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bounceValue: new Animated.Value(1),
      opacityValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    if (this.props.amount > 0) {
      this.showAmount(true);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.amount !== this.props.amount) {
      if (this.props.amount === 0) {
        this.showAmount(true);
      } else if (nextProps.amount === 0) {
        this.showAmount(false);
      }
      this.state.bounceValue.setValue(1.2);
      Animated.spring(this.state.bounceValue, {
        toValue: 1,
        friction: 4,
      }).start();
    }
  }

  showAmount = (state) => {
    Animated.spring(this.state.opacityValue, {
      toValue: state ? 1 : 0,
    }).start();
  };

  renderNotify = () => {
    const { amount, max, small, animated, color, top, right, left, bottom } =
      this.props;
    const style = small ? styles.small : styles.notify;
    let amountWidth =
      amount < 10
        ? {
            width: Screen.moderateScale(16),
            paddingLeft: Screen.moderateScale(4),
          }
        : null;
    amountWidth =
      amount > max
        ? {
            width: Screen.moderateScale(16),
            paddingLeft: Screen.moderateScale(3),
          }
        : amountWidth;
    const count = max !== 0 && amount > max ? "N" : amount;
    const inside = !small ? (
      <Text style={[styles.amount, amountWidth]}>{count}</Text>
    ) : null;
    let animate;
    const position = {
      top:
        bottom !== null
          ? null
          : top ||
            (small ? Screen.moderateScale(18) : Screen.moderateScale(10)),
      right:
        left !== null
          ? null
          : right ||
            (small ? Screen.moderateScale(18) : Screen.moderateScale(10)),
      bottom: bottom || null,
      left: left || null,
    };
    switch (animated) {
      case "pop":
        animate = { transform: [{ scale: this.state.bounceValue }] };
        break;
      case "bounce":
        animate = {
          transform: [
            {
              translateY: this.state.bounceValue.interpolate({
                inputRange: [1, 1.2],
                outputRange: [0, -5],
              }),
            },
          ],
        };
        break;
      default:
    }
    const notify = (
      <Animated.View
        style={[
          position,
          style,
          animate,
          {
            opacity: this.state.opacityValue,
            backgroundColor: color,
          },
        ]}
      >
        {inside}
      </Animated.View>
    );
    return notify;
  };

  render() {
    const { children, style } = this.props;
    const notify = this.renderNotify();
    // console.log(this.props);
    return (
      <View style={[styles.container, style]}>
        {children}
        {notify}
      </View>
    );
  }
}

NotifyBox.propTypes = {
  amount: PropTypes.number,
  max: PropTypes.number,
  small: PropTypes.bool,
  animated: PropTypes.oneOf(["none", "pop", "bounce"]),
  color: PropTypes.string,
  top: PropTypes.number,
  right: PropTypes.number,
  left: PropTypes.number,
  bottom: PropTypes.number,
};

NotifyBox.defaultProps = {
  amount: 0,
  max: 999,
  animated: "none",
  color: "red",
  top: null,
  right: null,
  left: null,
  bottom: null,
};
