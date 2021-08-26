import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Actions } from 'react-native-router-flux';
// eslint-disable-next-line react-native/split-platform-components
import { BackHandler, Platform, ToastAndroid } from 'react-native';

export const EVENTS = {
  CHANGE: 'change',
  HARDWARE_BACK_PRESS: 'hardwareBackPress',
};

class AndroidBackKey extends React.PureComponent {
  static propTypes = {
    backTo: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    backToProps: PropTypes.object,
    onBackKeyPress: PropTypes.func,
    routeName: PropTypes.string,
    sceneKey: PropTypes.string,
  };

  static defaultProps = {
    backTo: null,
    backToProps: undefined,
    onBackKeyPress: null,
    routeName: '',
    sceneKey: '',
  };

  /**
   * Register your event listeners when the app is mounted
   */
  componentDidMount() {
    // Android "Back" button trigger event listener
    if (Platform.OS === 'android') {
      this.backHandler = BackHandler.addEventListener(
        EVENTS.HARDWARE_BACK_PRESS,
        this.onAndroidBackButtonPressed,
      );
    }
  }

  /**
   * You must unregister listeners when your component unmount
   */
  componentWillUnmount() {
    // Android "Back" button trigger event listener
    if (Platform.OS === 'android' && this.backHandler) {
      this.backHandler.remove();
    }
  }

  onAndroidBackButtonPressed = () => {
    const { routeName, sceneKey } = this.props;
    console.log('routeName=>', routeName);
    console.log('sceneKey=>', sceneKey);
    if (Platform.OS === 'android') {
      __DEV__ &&
        ToastAndroid.show(
          `Back button pressed at "${Actions.currentScene}"`,
          ToastAndroid.SHORT,
        );
    }
    if ((sceneKey && Actions.currentScene === sceneKey) || !sceneKey) {
      const { backTo, backToProps, onBackKeyPress } = this.props;

      const hasBackTo =
        (typeof backTo === 'string' && !isEmpty(backTo)) || typeof backTo === 'function';
      const hasBackToHandler = typeof onBackKeyPress === 'function';
      if (typeof backTo === 'string') {
        Actions[backTo](backToProps);
      }
      if (typeof backTo === 'function') {
        backTo(backToProps);
      }
      if (hasBackToHandler) {
        onBackKeyPress(backToProps);
      }
      if (hasBackTo || hasBackToHandler) {
        if (this.backHandler && !sceneKey) {
          this.backHandler.remove();
        }
        return true;
      }
    }
    return false;
  };

  render() {
    return null;
  }
}

export default AndroidBackKey;
