import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Colors } from '~/Theme';
import { Screen, StyleSheet } from '~/Helpers';

const styles = StyleSheet.create({
  separator: {
    marginTop: '20@vs',
    marginBottom: '15@vs',
    borderStyle: 'solid',

    // flex: 1,
    height: '1@vs',
    width: 200,
    alignItems: 'center',
    alignSelf: 'center',
  },
  fullWidth: {
    flex: 1,
    width: Screen.width,
  },
});

const Separator = ({ fullWidth, width, color, size }) => (
  <View
    style={[
      styles.separator,
      width && { width },
      fullWidth && styles.fullWidth,
      {
        borderBottomWidth: size,
        borderBottomColor: color,
      },
    ]}
  />
);

Separator.propTypes = {
  fullWidth: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string,
  size: PropTypes.number,
};

Separator.defaultProps = {
  fullWidth: false,
  width: undefined,
  color: Colors.black,
  size: 1,
};

export default Separator;
