import React from 'react';
import PropTypes from 'prop-types';
import { Keyboard } from 'react-native';

export const EVENTS = {
  onKeyboardWillShow: 'keyboardWillShow',
  onKeyboardDidShow: 'keyboardDidShow',
  onKeyboardWillHide: 'keyboardWillHide',
  onKeyboardDidHide: 'keyboardDidHide',
  onKeyboardWillChangeFrame: 'keyboardWillChangeFrame',
  onKeyboardDidChangeFrame: 'keyboardDidChangeFrame',
};

class KeyboardHandler extends React.PureComponent {
  static propTypes = {
    routeName: PropTypes.string,
    sceneKey: PropTypes.string,
    onKeyboardWillShow: PropTypes.func,
    onKeyboardDidShow: PropTypes.func,
    onKeyboardWillHide: PropTypes.func,
    onKeyboardDidHide: PropTypes.func,
    onKeyboardWillChangeFrame: PropTypes.func,
    onKeyboardDidChangeFrame: PropTypes.func,
  };

  static defaultProps = {
    routeName: '',
    sceneKey: '',
    onKeyboardWillShow: () => {},
    onKeyboardDidShow: () => {},
    onKeyboardWillHide: () => {},
    onKeyboardDidHide: () => {},
    onKeyboardWillChangeFrame: () => {},
    onKeyboardDidChangeFrame: () => {},
  };

  /**
   * Register your event listeners when the app is mounted
   */
  componentDidMount() {
    const {
      onKeyboardWillShow,
      onKeyboardDidShow,
      onKeyboardWillHide,
      onKeyboardDidHide,
      onKeyboardWillChangeFrame,
      onKeyboardDidChangeFrame,
    } = this.props;

    if (onKeyboardWillShow) {
      Keyboard.addListener(EVENTS.onKeyboardWillShow, onKeyboardWillShow);
    }
    if (onKeyboardDidShow) {
      Keyboard.addListener(EVENTS.onKeyboardDidShow, onKeyboardDidShow);
    }
    if (onKeyboardWillHide) {
      Keyboard.addListener(EVENTS.onKeyboardWillHide, onKeyboardWillHide);
    }
    if (onKeyboardDidHide) {
      Keyboard.addListener(EVENTS.onKeyboardDidHide, onKeyboardDidHide);
    }
    if (onKeyboardWillChangeFrame) {
      Keyboard.addListener(EVENTS.onKeyboardWillChangeFrame, onKeyboardWillChangeFrame);
    }
    if (onKeyboardDidChangeFrame) {
      Keyboard.addListener(EVENTS.onKeyboardDidChangeFrame, onKeyboardDidChangeFrame);
    }
  }

  /**
   * You must unregister listeners when your component unmount
   */
  componentWillUnmount() {
    const {
      onKeyboardWillShow,
      onKeyboardDidShow,
      onKeyboardWillHide,
      onKeyboardDidHide,
      onKeyboardWillChangeFrame,
      onKeyboardDidChangeFrame,
    } = this.props;

    if (onKeyboardWillShow) {
      Keyboard.removeListener(EVENTS.onKeyboardWillShow);
    }
    if (onKeyboardDidShow) {
      Keyboard.removeListener(EVENTS.onKeyboardDidShow);
    }
    if (onKeyboardWillHide) {
      Keyboard.removeListener(EVENTS.onKeyboardWillHide);
    }
    if (onKeyboardDidHide) {
      Keyboard.removeListener(EVENTS.onKeyboardDidHide);
    }
    if (onKeyboardWillChangeFrame) {
      Keyboard.removeListener(EVENTS.onKeyboardWillChangeFrame);
    }
    if (onKeyboardDidChangeFrame) {
      Keyboard.removeListener(EVENTS.onKeyboardDidChangeFrame);
    }
  }

  render() {
    return null;
  }
}

export default KeyboardHandler;
