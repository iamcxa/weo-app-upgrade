import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity } from 'react-native';

export default class ImageButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    style: PropTypes.any,
    imageStyle: PropTypes.any,
    onPress: PropTypes.func,
    height: PropTypes.any,
    width: PropTypes.any,
    source: PropTypes.any,
    blurRadius: PropTypes.number,
    resizeMode: PropTypes.string,
  };

  static defaultProps = {
    onPress: () => {},
    source: '',
    resizeMode: 'center',
    blurRadius: 0,
    disabled: false,
    height: 'auto',
    width: 'auto',
    style: {},
    imageStyle: {},
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.btnClick = false;
  }

  handleOnPress = () => {
    const { disabled, onPress } = this.props;

    if (!disabled) {
      if (!this.btnClick) {
        this.btnClick = true;
        if (onPress) {
          onPress();
        }
        setTimeout(() => {
          this.btnClick = false;
        }, 200);
      }
    }
  };

  render() {
    const { height, width, style, source, disabled, imageStyle, resizeMode, blurRadius } =
      this.props;
    return (
      <TouchableOpacity
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            height,
            width,
          },
          style,
        ]}
        onPress={this.handleOnPress}
        activeOpacity={disabled ? 1 : 0.2}
      >
        <Image
          source={source}
          blurRadius={blurRadius}
          resizeMode={resizeMode}
          style={[
            {
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            },
            imageStyle,
          ]}
        />
      </TouchableOpacity>
    );
  }
}
