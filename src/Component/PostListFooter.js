import _ from 'lodash';
import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Colors from '~/Theme/Colors';
import Screen from '../utils/screen';

const styles = StyleSheet.create({
  listFooter: {
    paddingVertical: Screen.moderateScale(44),
    paddingLeft: Screen.moderateScale(34),
    justifyContent: 'center',
    alignItems: 'center',
  },
  listFooterLabel: {
    fontSize: Screen.moderateScale(14),
    textAlign: 'center',
    color: Colors.warmGrey,
  },
});

const messages = [
  '你點睇？講嚟聽下...',
  '吹下水姐，有野唔怕講...',
  '個Topic關你事喎，講句野啦...',
  '無人知道係你，有野唔怕問...',
  '你有高見嘅，講出嚟教下大家啦...',
];

export default class ListFooter extends Component {
  componentDidMount() {
    this.randomMessage = messages[_.random(0, messages.length - 1)];
  }

  render() {
    return (
      <View style={styles.listFooter}>
        <Text style={styles.listFooterLabel}>{this.randomMessage}</Text>
      </View>
    );
  }
}
