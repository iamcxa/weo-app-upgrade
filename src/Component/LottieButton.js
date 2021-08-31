import React from 'react';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import { Animated, Easing } from 'react-native';
import { RoundButton } from '@ublocks-react-native/component';

import { StyleSheet } from '~/Helper';
import { Classes } from '~/Theme';

const styles = StyleSheet.create({
  buttonBase: {
    height: '128@sr',
  },
});

export default class LottieButton extends React.Component {
  lottie = null;

  static propTypes = {
    // button props
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    onPressIn: PropTypes.func,
    onPressOut: PropTypes.func,
    delayLongPress: PropTypes.number,
    delayPressIn: PropTypes.number,
    delayPressOut: PropTypes.number,
    style: PropTypes.any,
    // lottie props
    speed: PropTypes.number,
    loop: PropTypes.bool,
    autoPlay: PropTypes.bool,
    autoSize: PropTypes.bool,
    source: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    animationStyle: PropTypes.any,
    duration: PropTypes.number,
    onAnimationFinish: PropTypes.func,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    // button props
    onPress: undefined,
    onPressIn: undefined,
    onPressOut: undefined,
    onLongPress: undefined,
    delayLongPress: undefined,
    delayPressIn: 150,
    delayPressOut: 50,
    style: {},
    // lottie props
    speed: 1,
    source: '',
    loop: true,
    autoPlay: false,
    autoSize: true,
    animationStyle: {},
    duration: undefined,
    onAnimationFinish: () => {},
    disabled: false,
  };

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const { duration } = this.props;
  //   if (nextProps.duration && prevState.) {
  //     return {
  //       progress: new Animated.Value(0),
  //     };
  //   }
  //   return null;
  // }

  constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0),
      isPlaying: props.autoPlay,
    };
  }

  componentDidMount() {
    const { duration } = this.props;
    if (duration) {
      Animated.timing(this.state.progress, {
        easing: Easing.linear,
        toValue: 1,
        duration,
      }).start();
    }
  }

  play = (startFrame, endFrame) => {
    this.lottie.play(startFrame, endFrame);
    this.setState({ isPlaying: true });
  };

  reset = (frame) => {
    this.lottie.reset(frame);
    this.setState({ isPlaying: false });
  };

  isPlaying = () => this.state.isPlaying;

  render() {
    const {
      // button props
      onPress,
      onPressIn,
      onPressOut,
      onLongPress,
      delayLongPress,
      delayPressIn,
      delayPressOut,
      style: buttonStyle,
      // lottie props
      source,
      speed,
      loop,
      autoPlay,
      autoSize,
      animationStyle,
      duration,
      disabled,
      onAnimationFinish,
    } = this.props;
    return (
      <RoundButton
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onLongPress={onLongPress}
        delayPressIn={delayPressIn}
        delayPressOut={delayPressOut}
        delayLongPress={delayLongPress}
        style={[styles.buttonBase, buttonStyle]}
        disabled={disabled}
        transparent
      >
        <LottieView
          ref={(lottie) => {
            this.lottie = lottie;
          }}
          source={source}
          style={animationStyle}
          onAnimationFinish={onAnimationFinish}
          progress={this.state.progress}
          autoPlay={autoPlay}
          autoSize={autoSize}
          speed={speed}
          loop={loop}
        />
      </RoundButton>
    );
  }
}
