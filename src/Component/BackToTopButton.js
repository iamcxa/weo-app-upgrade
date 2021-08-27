import React, { Component } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

import { Images, Colors } from 'App/Theme';
import { Screen, ScaledSheet } from 'App/Helpers';

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    width: '48@s',
    height: '48@s',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 48,
    right: '24@s',
    elevation: 5,
  },
  image: { flex: 1, elevation: 1 },
});

export default class ScrollTopButton extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={[styles.container, this.props.style]}>
        <Image source={Images.backToTop} />
      </TouchableOpacity>
    );
  }
}
