import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '~/Theme/Colors';
import Screen from '../utils/screen';

export default function ListSeparator(props) {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    height: Screen.moderateScale(3),
    marginTop: Screen.moderateScale(-2),
    borderBottomWidth: Screen.moderateScale(1),
    borderColor: Colors.silverTwo,
  },
});
