import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Colors from 'App/Theme/Colors';
import NotifyBox from './NotifyBox';
import Screen from '../utils/screen';
import { DefaultText } from '../widget/Label';

const Button = require('./ScrollableButton');

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Screen.moderateScale(10),
  },
  flexOne: {
    flex: 1,
  },
  tabs: {
    height: Screen.moderateScale(50),
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
});

export default class DefaultTabBar extends Component {
  static propTypes = {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: ViewPropTypes.style,
    renderTab: PropTypes.func,
    underlineStyle: ViewPropTypes.style,
  };

  static defaultProps = {
    activeTextColor: 'navy',
    inactiveTextColor: 'black',
    backgroundColor: null,
  };

  renderTabOption(name, page) {}

  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeTextColor, inactiveTextColor, textStyle, notify } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : 'normal';
    const data = JSON.parse(name);
    return (
      <NotifyBox
        amount={data.notify || 0}
        color={Colors.pink}
        animated="pop"
        bottom={Screen.moderateScale(30)}
        right={Screen.moderateScale(50)}
        small
      >
        <Button
          style={styles.flexOne}
          key={name}
          accessible
          accessibilityLabel={name}
          accessibilityTraits="button"
          onPress={() => onPressHandler(page)}
        >
          <View style={[styles.tab, this.props.tabStyle]}>
            <DefaultText style={[{ color: textColor, fontWeight }, textStyle]}>
              {data.title}
            </DefaultText>
          </View>
        </Button>
      </NotifyBox>
    );
  }

  render() {
    const { containerWidth } = this.props;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    };

    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, containerWidth / numberOfTabs],
    });
    return (
      <View
        style={[styles.tabs, { backgroundColor: this.props.backgroundColor }, this.props.style]}
      >
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, this.props.goToPage);
        })}
        <Animated.View style={[tabUnderlineStyle, { left }, this.props.underlineStyle]} />
      </View>
    );
  }
}
