import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({});

const defaultProps = {
  type: 'none',
};
const propTypes = {
  type: PropTypes.oneOf([
    'none',
    'telephone',
    'phone',
    'identity',
    'billingAddress',
    'address',
    'name',
  ]),
};

const hide = {
  none: (str) => str,
  telephone: (str) => str.replace(/.{3}$/, '***'),
  phone: (str) => str.replace(/(.{5}).{3}/, '$1***'),
  identity: (str) => str.replace(/.{4}$/, '****'),
  billingAddress: (str) => str.replace(/(區|里).*$/, '$1******'),
  address: (str) => str.replace(/.{6}$/, '******'),
  name: (str) => {
    if (str.length === 2) {
      return str.replace(/.$/, '*');
    } else if (str.length === 3) {
      return str.replace(/(.)./, '$1*');
    }
    return str.replace(/(^.)(.*)(.$)/, '$1**$3');
  },
};

const PrivateText = (props) => {
  const { type } = props;
  return <Text {...props}>{hide[type](props.children)}</Text>;
};

PrivateText.propTypes = propTypes;
PrivateText.defaultProps = defaultProps;
export default PrivateText;
