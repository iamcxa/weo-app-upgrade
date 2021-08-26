import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Screen from '../utils/screen';

const styles = StyleSheet.create({
  button: {
    // flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    height: Screen.moderateScale(35),
    borderWidth: Screen.onePixel * 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#000',
    fontSize: Screen.moderateScale(18),
  },
});

export default class RoundButton extends Component {
  static propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    onPress: PropTypes.func.isRequired,
    btnColor: PropTypes.string,
    btnStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    text: PropTypes.string,
    textColor: PropTypes.string,
    textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    borderColor: PropTypes.string,
    disablePress: PropTypes.bool,
    hitSlop: PropTypes.object,
    numberOfLines: PropTypes.number,
    component: PropTypes.any,
  };

  static defaultProps = {
    numberOfLines: 1,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.btnClick = false;
  }

  render() {
    const {
      style,
      onPress,
      btnColor,
      btnStyle,
      text,
      textStyle,
      textColor,
      borderColor,
      disablePress,
      hitSlop,
      numberOfLines,
      component,
    } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.button,
          btnStyle,
          {
            backgroundColor: btnColor,
            borderColor: borderColor || btnColor,
          },
          style,
        ]}
        onPress={() => {
          if (!disablePress) {
            if (!this.btnClick) {
              this.btnClick = true;
              if (onPress) {
                onPress();
              }
              setTimeout(() => {
                this.btnClick = false;
              }, 100);
            }
          }
        }}
        activeOpacity={disablePress ? 1 : 0.2}
        hitSlop={hitSlop}
      >
        {component || (
          <Text
            style={[styles.buttonText, textStyle, { color: textColor }]}
            numberOfLines={numberOfLines}
          >
            {text}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}
