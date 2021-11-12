import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Animated,
  Text,
  View,
  Dimensions,
  Easing,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { Screen } from "~/Helper";

const WINDOW = Dimensions.get("window");
const HEIGHT = WINDOW.height;
const WIDTH = WINDOW.width;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingBottom: Screen.isX ? Screen.scale(15) : 0,
  },
  fullScreen: {
    height: HEIGHT,
    width: WIDTH,
  },
  mask: {
    position: "absolute",
    backgroundColor: "rgb(3, 3, 3)",
  },
  content: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
});

export default class BottomPopup extends Component {
  static propTypes = {
    children: PropTypes.node,
    animateDuration: PropTypes.number,
    maskOpacity: PropTypes.number,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    showCloseButton: PropTypes.bool,
  };

  static defaultProps = {
    animateDuration: 300,
    maskOpacity: 0.5,
    showCloseButton: false,
    onOpen: () => {},
    onClose: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      showPicker: false,
      animatedTop: new Animated.Value(HEIGHT),
      animatedMaskOpacity: new Animated.Value(0),
    };
  }

  open = () => {
    this.props.onOpen();
    this.setState({
      showPicker: true,
    });
    Animated.parallel([
      Animated.timing(this.state.animatedMaskOpacity, {
        toValue: this.props.maskOpacity,
        duration: this.props.animateDuration,
        easing: Easing.linear,
      }),
      Animated.timing(this.state.animatedTop, {
        toValue: 0,
        duration: this.props.animateDuration,
        easing: Easing.linear,
      }),
    ]).start();
  };

  close = () => {
    this.props.onClose();
    Animated.parallel([
      Animated.timing(this.state.animatedMaskOpacity, {
        toValue: 0,
        duration: this.props.animateDuration,
        easing: Easing.linear,
      }),
      Animated.timing(this.state.animatedTop, {
        toValue: HEIGHT,
        duration: this.props.animateDuration,
        easing: Easing.linear,
      }),
    ]).start(() => {
      this.setState({
        showPicker: false,
      });
    });
  };

  render() {
    if (this.state.showPicker) {
      return (
        <Animated.View style={[styles.container, styles.fullScreen]}>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Animated.View
              style={[
                styles.fullScreen,
                styles.mask,
                {
                  position: "absolute",
                  opacity: this.state.animatedMaskOpacity,
                },
              ]}
            >
              <TouchableOpacity style={{ flex: 1 }} onPress={this.close} />
            </Animated.View>
            <Animated.View
              style={[
                styles.content,
                {
                  transform: [{ translateY: this.state.animatedTop }],
                },
              ]}
            >
              {this.props.children}
            </Animated.View>
          </View>
          {this.props.showCloseButton && (
            <TouchableOpacity
              onPress={this.close}
              style={{
                position: "absolute",
                top: 30,
                right: 20,
                backgroundColor: "transparent",
              }}
            >
              <Icon name="close" size={35} color="white" />
            </TouchableOpacity>
          )}
        </Animated.View>
      );
    }
    return null;
  }
}
