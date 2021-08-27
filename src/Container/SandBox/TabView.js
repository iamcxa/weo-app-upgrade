import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes } from 'react-native';
import Button from 'App/Components/Button';
import { Actions } from 'react-native-router-flux';

const contextTypes = {
  drawer: PropTypes.object,
};

const propTypes = {
  name: PropTypes.string,
  sceneStyle: ViewPropTypes.style,
  title: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderWidth: 2,
    borderColor: 'red',
  },
});

const TabView = (props, context) => (
  <View style={[styles.container, props.sceneStyle]}>
    <Text>Tab {props.title}</Text>
    {props.name === 'tab1_1' && <Button onPress={Actions.tab1_2} text="next screen for tab1_1" />}
    {props.name === 'tab2_1' && <Button onPress={Actions.tab2_2} text="next screen for tab2_1" />}
    <Button onPress={Actions.pop} text="Back" />
    <Button
      onPress={() => {
        Actions.tab1();
      }}
      text="Switch to tab1"
    />
    <Button
      onPress={() => {
        Actions.tab2();
      }}
      text="Switch to tab2"
    />
    <Button
      onPress={() => {
        Actions.tab3();
      }}
      text="Switch to tab3"
    />
    <Button
      onPress={() => {
        Actions.tab4();
      }}
      text="Switch to tab4"
    />
    <Button
      onPress={() => {
        Actions.tab5();
      }}
      text="Switch to tab5"
    />
  </View>
);

TabView.contextTypes = contextTypes;
TabView.propTypes = propTypes;

export default TabView;
