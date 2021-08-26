import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, View, Image, Platform } from 'react-native';
import Colors from 'App/Theme/Colors';
import Screen from '../utils/screen';
import NotifyBox from 'App/Components/NotifyBox';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

@connect(
  (state) => ({
    tab: state.tab,
  }),
  (dispatch) => bindActionCreators({}, dispatch),
)
class Notify extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View
        style={{
          position: 'absolute',
          ...(Screen.proportion == '4:3'
            ? {
                right: Screen.moderateScale(10),
                top: Screen.moderateScale(-7),
              }
            : {
                right: Screen.moderateScale(-2),
                top: Screen.moderateScale(-5),
              }),
          height: Screen.tabHeight,
          width: Screen.width / 5 + Screen.onePixel,
        }}
      >
        <NotifyBox amount={10} color={Colors.squash} animated="pop" max={99} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        height: Screen.tabHeight,
        width: Screen.width / 5 + Screen.onePixel,
      },
      android: {
        height: Screen.tabHeight,

        width: Screen.width / 5,
      },
    }),
  },
  ...Platform.select({
    ios: {
      title: {
        fontSize: Screen.moderateScale(14),
        fontWeight: '500',
        textAlign: 'center',
      },
      icon: {
        height: Screen.moderateScale(24),
        width: Screen.moderateScale(24),
        marginBottom: Screen.moderateScale(4),
      },
    },
    android: {
      title: {
        fontSize: Screen.moderateScale(14),
        fontWeight: '500',
        textAlign: 'center',
      },
      icon: {
        height: Screen.moderateScale(24),
        width: Screen.moderateScale(24),
        marginBottom: Screen.moderateScale(4),
      },
    },
  }),
  mainIcon: {
    width: Screen.moderateScale(37.5 * 2),
    height: Screen.moderateScale(32.5 * 2),
    marginBottom: Screen.moderateScale(10),
  },
});

const tabIconWH = {
  myRecord: {
    width: Screen.moderateScale(12.9 * 2),
    height: Screen.moderateScale(11.9 * 2),
  },
  secretary: {
    width: Screen.moderateScale(13 * 2),
    height: Screen.moderateScale(11 * 2),
  },
  phoneMask: {},
  mainWarningCircle: {},
  family: {
    width: Screen.moderateScale(15 * 2),
    height: Screen.moderateScale(12 * 2),
  },
  more: {
    width: Screen.moderateScale(11 * 2),
    height: Screen.moderateScale(11.5 * 2),
  },
  undefined: {},
};

const iconArray = {};

const propTypes = {
  focused: PropTypes.bool,
  title: PropTypes.string,
  iconName: PropTypes.string,
  notify: PropTypes.number,
};
const defaultProps = {
  notify: 0,
};

const TabIcon = (props) => {
  const { focused, iconName, mainIcon, notify } = props;
  const target = focused ? 'true' : 'false';
  // console.log("TabIcon!!!!!!!", iconName, props);
  let tabBackColor = Colors.tealish;
  if (focused) {
    tabBackColor = Colors.whiteThree;
  }
  if (mainIcon && Platform.OS === 'ios') {
    tabBackColor = Colors.tealish;
  }
  return (
    <View style={[styles.container, { backgroundColor: tabBackColor }]}>
      <Image
        source=""
        style={[
          styles.icon,
          props.tabIconStyle,
          focused ? { tintColor: Colors.tealish } : {},
          tabIconWH[iconName],
        ]}
        resizeMode="contain"
      />
      {mainIcon && Platform.OS === 'ios' ? null : (
        <Text
          style={[
            styles.title,
            props.moreTitleStyle,
            { color: focused ? Colors.tealish : Colors.whiteThree },
          ]}
        >
          {props.title}
        </Text>
      )}
      <Notify target={iconName} />
    </View>
  );
};

TabIcon.propTypes = propTypes;
TabIcon.defaultProps = defaultProps;
export default TabIcon;