/* eslint-disable react/no-unused-state */
/* eslint-disable no-console */
// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet } from 'react-native';
import Voice from '@react-native-community/voice';
import { Permissions } from 'react-native-unimodules';
// import Permissions, { PERMISSIONS } from 'react-native-permissions';
import { translate as t } from '~/Helpers/I18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    // position: 'absolute',
    // bottom: 0,
  },
});

class VoiceControl extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.func.isRequired, PropTypes.object.isRequired]),
    onSpeechEnd: PropTypes.func,
    onSpeechError: PropTypes.func,
    onSpeechStart: PropTypes.func,
    onSpeechResults: PropTypes.func,
    onSpeechRecognized: PropTypes.func,
    onSpeechVolumeChanged: PropTypes.func,
    onSpeechPartialResults: PropTypes.func,
  };

  static defaultProps = {
    children: null,
    onSpeechEnd: () => {},
    onSpeechError: () => {},
    onSpeechStart: () => {},
    onSpeechResults: () => {},
    onSpeechRecognized: () => {},
    onSpeechVolumeChanged: () => {},
    onSpeechPartialResults: () => {},
  };

  constructor(props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }

  state = {
    circleAvailable: false,
    sentence: '',
    recognized: '',
    raw: '',
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: [],
    partialResults: [],
    isListening: false,
    waitVoiceControlLoad: false,
  };

  async componentDidMount() {
    // await this.setupAudioRecordingPermission();
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  // setupAudioRecordingPermission = async () => {
  //   const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
  //   if (status !== 'granted') {
  //     Alert.alert(
  //       'Wait!',
  //       'Please give WEO AUDIO RECORDING permission to send your topic message by speaking!',
  //       [
  //         {
  //           text: t('__cancel'),
  //           onPress: () => {},
  //           style: 'cancel',
  //         },
  //         { text: t('__open_system_setting'), onPress: Permissions.openSettings },
  //       ],
  //     );
  //     await Permissions.getAsync(Permissions.AUDIO_RECORDING);
  //   }
  // };

  onSpeechStart = (e) => {
    console.log('onSpeechStart: ', e);
    this.setState({
      started: '√',
      waitVoiceControlLoad: false,
    });
    this.props.onSpeechStart(e);
  };

  onSpeechRecognized = (e) => {
    console.log('onSpeechRecognized: ', e);
    this.setState({
      recognized: '√',
    });
    this.props.onSpeechRecognized(e);
  };

  onSpeechEnd = () => {
    console.log('onSpeechEnd!');
    this.setState({
      end: '√',
    });
    this.props.onSpeechEnd(this.state.results);
  };

  onSpeechError = (e) => {
    console.warn('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
    });
    this.props.onSpeechError(e);
  };

  onSpeechResults = (e) => {
    console.log('onSpeechResults: ', e);
    this.setState({
      results: e.value,
      // sentence: e.value[0], //e.value.toString().replace(',', ' '),
    });
    this.props.onSpeechResults(e.value);
  };

  onSpeechPartialResults = (e) => {
    console.log('onSpeechPartialResults: ', e);
    this.setState({
      partialResults: e.value,
      sentence: e.value[0],
      raw: e,
    });
    this.props.onSpeechPartialResults(e.value);
  };

  onSpeechVolumeChanged = (e) => {
    console.log('onSpeechVolumeChanged: ', e);
    this.setState({
      pitch: e.value,
    });
    this.props.onSpeechVolumeChanged(e);
  };

  isListening = () => this.state.isListening;

  startListening = async (locale = 'zh_Hant_HK') => {
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
    try {
      const isAvailable = await Voice.isAvailable();
      if (isAvailable) {
        const result = await Voice.start(locale, {
          RECOGNIZER_ENGINE: 'GOOGLE',
          EXTRA_MAX_RESULTS: 1,
          EXTRA_PARTIAL_RESULTS: false,
          REQUEST_PERMISSIONS_AUTO: true,
        });
        if (!result) {
          this.setState({
            isListening: true,
            // await Voice.isRecognizing(),
          });
        }
      } else {
        throw new Error('Voice Recognizing not available now');
      }
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  };

  stopListening = async (onSuccess) => {
    try {
      await Voice.stop();
      await Voice.destroy();
      this.setState(
        {
          isListening: false,
          sentence: '',
        },
        onSuccess,
      );
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  };

  render() {
    const { children } = this.props;
    return (
      <>
        {typeof children === 'object'
          ? children
          : children({
              state: this.state,
              stopListening: this.stopListening,
              startListening: this.startListening,
              isListening: this.state.isListening,
            })}
      </>
    );
  }
}

export default VoiceControl;
