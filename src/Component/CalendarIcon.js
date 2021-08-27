import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import Colors from 'App/Theme/Colors';
import Screen from '../utils/screen';

const styles = StyleSheet.create({
  container: {
    borderRadius: Screen.moderateScale(1.5 * 2),
    overflow: 'hidden',
  },
  header: {
    backgroundColor: Colors.cornflowerBlue,
    borderColor: Colors.cornflowerBlue,
    borderWidth: 1,
  },
  headerText: {
    padding: Screen.moderateScale(4),
    fontSize: Screen.moderateScale(7 * 2),
    fontWeight: '500',
    letterSpacing: 0.25 * 2,
    textAlign: 'center',
    color: Colors.whiteThree,
  },
  content: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.paleGrey,
    borderWidth: 1,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 0.5,
    shadowOpacity: 1,
  },
});

const defaultProps = {
  title: '2017',
};

const propTypes = {
  title: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  headerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  headerTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  contentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
};

const CalendarIcon = (props) => (
  // const {} = props;
  <View style={[styles.container, props.style]}>
    <View style={[styles.header, props.headerStyle]}>
      <Text style={[styles.headerText, props.headerTextStyle]}>{props.title}</Text>
    </View>
    <View style={[styles.content, props.contentStyle]}>{props.children}</View>
  </View>
);

CalendarIcon.propTypes = propTypes;
CalendarIcon.defaultProps = defaultProps;
export default CalendarIcon;
