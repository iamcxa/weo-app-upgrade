import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Screen from '../utils/screen';

const styles = StyleSheet.create({});

export default class ListItem extends Component {
  static propTypes = {
    onPress: PropTypes.onPress,
  };

  static defaultProps = {
    onPress: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.btnClick = false;
  }

  render() {
    const { style, children, disablePress, onPress } = this.props;
    return (
      <TouchableOpacity
        style={[{ flex: 1, padding: Screen.moderateScale(15) }, style]}
        onPress={() => {
          if (!disablePress) {
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
        }}
        activeOpacity={disablePress ? 1 : 0.2}
      >
        {children}
      </TouchableOpacity>
    );
  }
}
