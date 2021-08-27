import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Button,
  Keyboard,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Colors from '~/Theme/Colors';
import { PrimaryBtn, SubBtn, LineBtn, LogoBtn } from '../widget/Button';
import Screen from '../utils/screen';

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');
const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
export default class BaseLightbox extends Component {
  static propTypes = {
    containerStyle: PropTypes.any,
    children: PropTypes.any.isRequired,
    horizontalPercent: PropTypes.number,
    verticalPercent: PropTypes.number,
    heightOffset: PropTypes.number,
  };

  static defaultProps = {
    containerStyle: {},
    horizontalPercent: 1,
    verticalPercent: 1,
    heightOffset: 0,
  };

  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.spring(this.state.opacity, {
      duration: 700,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }

  closeModal = ({ type = 'close' }) => {
    Keyboard.dismiss();
    Animated.spring(this.state.opacity, {
      duration: 500,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      if (type === 'submit') {
        this.props.onSubmit();
      }
      Actions.pop();
    });
  };

  _renderLightBox = () => {
    const {
      children,
      horizontalPercent,
      verticalPercent,
      closeText,
      submitText,
      childrenContainerStyle,
      heightOffset,
    } = this.props;
    const height =
      this.props.height || verticalPercent
        ? deviceHeight * verticalPercent + heightOffset
        : deviceHeight + heightOffset;
    const width =
      this.props.width || horizontalPercent ? deviceWidth * horizontalPercent : deviceWidth;
    return (
      <View
        style={[
          {
            width,
            height,
            // justifyContent: 'center',
            // alignItems: 'center',
            padding: Screen.moderateScale(30),
          },
          childrenContainerStyle,
        ]}
      >
        <View style={[{ height }, childrenContainerStyle]}>{children}</View>
      </View>
    );
  };

  render() {
    const { containerStyle } = this.props;
    const { opacity } = this.state;
    const moveTopY = opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    });
    return (
      <AnimatedSafeAreaView
        useNativeDriver
        style={[
          styles.container,
          {
            opacity: this.state.opacity,
            transform: [
              {
                translateY: moveTopY,
              },
            ],
          },
          containerStyle,
        ]}
      >
        {this._renderLightBox()}
      </AnimatedSafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFA',
    // height: Screen.height,
    // width: Screen.width,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
