import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CheckboxList from 'App/Components/CheckboxList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class CheckboxListDemo extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const array = [1, 2, 3, 4, 5];
    return (
      <View style={styles.container}>
        <CheckboxList rightContent={array} />
      </View>
    );
  }
}
