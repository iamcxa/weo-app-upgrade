import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Image } from 'react-native';

import { Images } from '~/Theme';
import { StyleSheet, Screen } from '~/Helper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -100,
  },
  iconWrapper: {
    borderRadius: Screen.scale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class CustomTabIcon extends React.PureComponent {
  static propTypes = {
    focused: PropTypes.bool,
    title: PropTypes.string,
    iconName: PropTypes.string,
    iconNameActive: PropTypes.string,
    iconType: PropTypes.string,
    iconStyle: PropTypes.object,
    iconSize: PropTypes.number,
    iconColor: PropTypes.string,
    tabBackColor: PropTypes.string,
    hasUnRead: PropTypes.bool,
  };

  static defaultProps = {
    // notify: 0
    iconNameActive: undefined,
    iconStyle: {},
    iconSize: 26,
    hasUnRead: false,
  };

  state = {
    iconType: undefined,
    iconColor: 'black',
    tabBackColor: 'transparent',
  };

  render() {
    const {
      focused,
      iconType,
      iconName,
      iconNameActive = this.props.iconName,
      iconStyle,
      iconSize,
      iconColor,
      tabBackColor,
      hasUnRead,
    } = this.props;
    let iconKey;
    if (iconName === 'bell') {
      iconKey = focused ? 'bell_active' : hasUnRead ? 'bell_new' : 'bell';
    } else {
      iconKey = focused ? `${iconName}_active` : iconName;
    }
    return (
      <View
        pointerEvents="none"
        style={[styles.container, { backgroundColor: tabBackColor }, iconStyle]}
      >
        {Images[iconKey] ? (
          <Image source={Images[iconKey]} style={iconStyle} />
        ) : (
          <View
            style={[
              styles.iconWrapper,
              {
                width: Screen.scale(iconSize),
                height: Screen.scale(iconSize),
              },
            ]}
          >
            <Icon
              name={focused ? iconNameActive : iconName}
              size={Screen.scale(iconSize)}
              style={[styles.icon, { color: iconColor }]}
            />
          </View>
        )}
      </View>
    );
  }
}

export default connect(
  (state, prams) => ({
    hasUnRead: state.notification.hasUnRead,
  }),
  (dispatch) => bindActionCreators({}, dispatch),
)(CustomTabIcon);
