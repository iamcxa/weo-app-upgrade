import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, Switch, Platform } from 'react-native';
import { Screen } from '~/Helper';
import { Classes, Colors, Metrics, Fonts } from '~/Theme';

const styles = StyleSheet.create({
  content: {
    backgroundColor: Colors.whiteThree,
    alignItems: 'center',
    borderBottomColor: Colors.silver,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.baseMargin * 4,
    paddingVertical: Metrics.baseMargin * 2,
  },
  txtDesc: {
    color: Colors.greyishBrown,
    marginTop: Metrics.baseMargin / 2,
  },
});

export default class SwitchListItem extends React.PureComponent {
  static propTypes = {
    onValueChange: PropTypes.func.isRequired,
    value: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    style: PropTypes.any,
  };

  static defaultProps = {
    onValueChange: () => {},
    value: false,
    title: '',
    description: '',
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onValueChange, value, title, description, style } = this.props;
    return (
      <View style={[styles.content, style]}>
        <View style={Classes.fill}>
          <Text style={Fonts.style.regular}>{title}</Text>
          {!!description && <Text style={[Fonts.style.medium, styles.txtDesc]}>{description}</Text>}
        </View>
        <View style={Classes.crossEnd}>
          <Switch
            value={value}
            trackColor={Colors.lightishGreen}
            thumbTintColor={Platform.OS === 'android' ? Colors.whiteThree : null}
            onValueChange={onValueChange}
          />
        </View>
      </View>
    );
  }
}
