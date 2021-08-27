import React, { Component } from 'react';
import { Animated, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

export default class AnimateTransition extends Component {
  constructor(props) {
    super(props);
    this.fadeAnim = new Animated.Value(0);
  }

  show = () => {
    this.fadeAnim = new Animated.Value(0);
    Animated.timing(this.fadeAnim, {
      toValue: 0.99,
      duration: 250,
    }).start(() => {
      Actions.modal({ image: this.props.image });
    });
    setTimeout(() => {
      Animated.timing(this.fadeAnim, {
        toValue: 0,
        duration: 10,
      }).start();
    }, 500);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.image !== this.props.image) {
      this.show();
    }
  }

  render() {
    const opacity = this.fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const moveTopX = this.fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -this.props.x],
    });

    const moveTopY = this.fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.props.scrollViewPosition - this.props.y],
    });

    const width = this.fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.width, '100%'],
    });

    const height = this.fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.height, 300],
    });

    return (
      <Animated.Image
        style={{
          opacity,
          // zIndex: 100,
          // backgroundColor: 'red',
          position: 'absolute',
          left: this.props.x,
          top: this.props.y,
          width,
          height,
          transform: [
            {
              translateX: moveTopX,
            },
            {
              translateY: moveTopY,
            },
          ],
        }}
        source={{ uri: this.props.image }}
      />
    );
  }
}
