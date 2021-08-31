import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Keyboard,
  Animated,
  StyleSheet,
  // Text,
  // Picker,
  // Modal,
  // TouchableWithoutFeedback,
} from 'react-native';

import { Colors } from '~/Theme';
import { Screen, ListenableEvent } from '~/Helper';
import ReplyBar from '~/Components/ReplyBar';

import Config from '~/Config';
import KeyboardUtil from '../../utils/keyboard';

const { CIRCLE_TYPE } = Config;

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'row',
    // paddingHorizontal: Screen.moderateScale(15),
    // width: Screen.width,
    // justifyContent: 'space-around',
    // alignItems: 'flex-end',
    // borderTopWidth: StyleSheet.hairlineWidth * 2,
    // backgroundColor: 'white'
  },
  replyBar: {
    // position: 'absolute',
    // left: -190,
    // bottom: 0,
    // backgroundColor: 'white'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    padding: 4,
    backgroundColor: '#ececec',
  },
  pickerContainer: {
    backgroundColor: 'white',
  },
  lottieAnimation: {
    // flex: 1,
    width: Screen.width,
    // height: 60,
    // backgroundColor: 'gray',
    // zIndex: 500,
  },
  localeBtnWrapper: {
    position: 'absolute',
    bottom: -10,
    padding: 10,
    width: '100%',
    // backgroundColor: '#333',
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'none',
  },
  micBtnWrapper: {
    height: 0,
    width: Screen.width,
    display: 'flex',
    backgroundColor: Colors.paleGrey50,
  },
  micBtn: {
    width: Screen.width,
    height: 80,
  },
});

export default class VoiceReplyBar extends Component {
  replyBar = null;

  static propTypes = {
    // supportLanguages: PropTypes.array.isRequired,
    isListening: PropTypes.bool.isRequired,
    // onStopListening: PropTypes.func.isRequired,
    // // onTriggerKeyboard: PropTypes.func.isRequired,
    // onVoiceLanguageChanged: PropTypes.func.isRequired,
    onCreateTopicSuccess: PropTypes.func.isRequired,
    // onFocus: PropTypes.func.isRequired,
    voiceInputText: PropTypes.string,
    currentCircleId: PropTypes.number,
  };

  static defaultProps = {
    voiceInputText: '',
    currentCircleId: 0,
  };

  state = {
    modalVisible: false,
    locale: undefined,
    // items: [],
  };

  componentWillMount() {
    this.keyboardShowSub = Keyboard.addListener(
      ListenableEvent.KEYBOARD_SHOW,
      KeyboardUtil.keyboardShow,
    );
    // this.keyboardHideSub = Keyboard.addListener(
    //   Screen.keyboardHide,
    //   KeyboardUtil.keyboardHide,
    // );
    // if (this.replyBar.getWrappedInstance) {
    //   this.replyBar.getWrappedInstance().onBlur();
    // }
  }

  componentWillUnmount() {
    // this.keyboardShowSub.remove();
    // this.keyboardHideSub && this.keyboardHideSub.remove();
  }

  onBtnKeyboardPress = () => {
    // this.setState(prevState => ({
    //   modalVisible: !prevState.modalVisible,
    // }));
    // Keyboard.keyboardHide
    // this.props.onTriggerKeyboard();
    // console.log('this.replyBar=>', this.replyBar);
    this.onFocus();
  };

  onFocus = () => {
    if (this.replyBar) {
      this.replyBar.wrappedInstance.onFocus();
    }
  };

  render() {
    const {
      currentCircleId,
      // isShow,
      isListening,
      // isVoiceWaveOn,
      onCreateTopicSuccess,
      // onFocus,
      // onBlur,
      voiceInputText,
    } = this.props;
    return (
      <View style={styles.container}>
        <Animated.View style={styles.replyBar}>
          <ReplyBar
            onBlur={() => Keyboard.dismiss()}
            ref={(ref) => {
              this.replyBar = ref;
            }}
            style={{
              bottom: 0, // isListening ? 0 : -100,
            }}
            type="TOPIC"
            appendContent={voiceInputText}
            id={`${currentCircleId}`}
            belongsTo={currentCircleId ? CIRCLE_TYPE.HERE_YOU_ARE : CIRCLE_TYPE.THERE_YOU_ARE}
            onReplySuccess={onCreateTopicSuccess}
            maxLength={180}
            allowPhotoWithEmptyContent={false}
          />
        </Animated.View>
      </View>
    );
  }
}
