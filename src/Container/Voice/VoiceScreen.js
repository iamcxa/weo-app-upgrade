// @flow

import React from 'react';
import PropTypes from 'prop-types';
import PickerModal from 'react-native-picker-modal-view';
import {
  View,
  Text,
  Image,
  Alert,
  Platform,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import { Colors, Images } from '~/Theme';
import { translate as t } from '~/Helpers/I18n';
import { AppStateActions, AppPermissionSelectors } from '~/Stores';
import { Date as d, Dialog, Permission, Screen, ifIphoneX } from '~/Helpers';

import {
  MainNavBar,
  LottieButton,
  IconButton,
  DismissKeyboardView,
  AndroidBackKey,
} from '~/Components';

import soundAnimation from '~/Assets/Images/lottie/animation-soundwave.json';
import voiceAnimation from '~/Assets/Images/lottie/animation-voice.json';

import VoiceControl from './VoiceControl';
import VoiceReplyBar from './VoiceReplyBar';
import VoiceDebugView from './VoiceDebugView';

import styles from './VoiceScreenStyle';

const SUPPORT_LANGUAGES = () =>
  [
    /*
    - iOS locale list
      https://gist.github.com/jacobbubu/1836273
    - android locale list
      https://stackoverflow.com/questions/7973023/what-is-the-list-of-supported-languages-locales-on-android
  */
    {
      label: t('__speech_auto'),
      value: undefined,
    },
    {
      label: t('__speech_en_us'),
      value: 'en_US',
    },
    {
      label: t('__speech_zh_hant_hk'),
      value: Platform.OS === 'ios' ? 'zh_Hant_HK' : 'zh_HK',
    },
    {
      label: t('__speech_zh_hant_tw'),
      value: Platform.OS === 'ios' ? 'zh_Hant_TW' : 'zh_TW',
    },
  ].map((e) => ({
    Id: e.value,
    Name: e.label,
    Value: e.value,
  }));

class VoiceScreen extends React.Component {
  static propTypes = {
    routeName: PropTypes.string.isRequired,
    // circle: PropTypes.object.isRequired,
    currentCircle: PropTypes.object,
    sceneKey: PropTypes.string.isRequired,
    userCircle: PropTypes.object,
    currentNetworkInfo: PropTypes.object.isRequired,
    hasSpeechPermission: PropTypes.bool.isRequired,
    hasMicrophonePermission: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    currentCircle: {},
    userCircle: {},
  };

  replyBar = null;

  Lottie = null;

  Voice = null;

  constructor(props) {
    super(props);
    this.state = {
      isDebug: false,
      isPlay: false,
      isButtonLocked: false,
      isMicAnimationShow: true,
      isReplyBarShow: false,
      isWaitVoiceControlLoad: false,
      animation: voiceAnimation,
      locale: SUPPORT_LANGUAGES()[0],
      voiceInputText: '',
      voiceInputTextTemp: '',
      isButtonPressed: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isPlay: true,
      });
    }, 1000);
  }

  componentDidUpdate(prevProps) {
    const { sceneKey, routeName } = this.props;
    if (routeName !== prevProps.routeName && sceneKey.includes(routeName)) {
      if (this.state.isPlay && this.Lottie) {
        this.Lottie.reset();
        this.Lottie.play();
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { sceneKey, routeName } = this.props;
    return !isEqual(this.state, nextState) || !isEqual(this.props, nextProps);
  }

  _getVoiceRef = (e) => {
    this.Voice = e;
  };

  _getAnimatedButtonRef = (e) => {
    this.Lottie = e;
  };

  _getReplyBarRef = (ref) => {
    this.replyBar = ref;
  };

  onPressStartRecord = (voiceControl) => async () => {
    Keyboard.dismiss();
    const { isButtonPressed } = this.state;
    const { hasMicrophonePermission } = this.props;

    if (!hasMicrophonePermission) {
      return Permission.requestMicrophonePermission();
    }

    if (!isButtonPressed && voiceControl) {
      const { isListening } = voiceControl.state;
      if (!isListening) {
        const { locale } = this.state;
        if (locale.Value) {
          await voiceControl.startListening(locale.Value);
        } else {
          await voiceControl.startListening();
        }
        this.setState({ isButtonPressed: true });
      }
    }
  };

  onPressStopRecord = (voiceControl) => () => {
    if (voiceControl) {
      setTimeout(
        async () => {
          const { isListening } = voiceControl.state;
          // console.log('isListening=>', isListening);
          if (isListening) {
            await voiceControl.stopListening(() => {
              this.setState((state) => ({
                isButtonPressed: false,
                animation: voiceAnimation,
                voiceInputText: state.voiceInputTextTemp,
                voiceInputTextTemp: '',
              }));
            });
          }
        },
        // 雙平台需要的等待時間不同
        Platform.OS === 'ios' ? 1000 : 3000,
      );
    }
  };

  onSpeechStart = () => {
    this.setState({
      isReplyBarShow: true,
      isWaitVoiceControlLoad: false,
      animation: soundAnimation,
    });
  };

  onSpeechEnd = (text) => {
    console.log('onSpeechEnd text=>', text);
    this.setState({
      animation: voiceAnimation,
      // voiceInputText: typeof text === 'string' ? text : text[0],
      voiceInputText: '',
      voiceInputTextTemp: '',
    });
  };

  onSpeechResults = (text) => {
    // Android / ios 語音辨識結果會在不同週期出現
    if (Platform.OS === 'ios') {
      this.setState({
        voiceInputTextTemp: typeof text === 'string' ? text : text[0],
      });
    } else {
      this.setState({
        voiceInputText: typeof text === 'string' ? text : text[0],
      });
    }
  };

  handleCreateTopicSuccess = (res) => {
    const { data } = res;

    Actions.hereYouAre_postList({
      topicId: data.id,
      title: data.title,
      content: data.content,
      avatar: data.memberAvatar,
      authorName: data.memberName,
      authorHash: data.memberHash,
      createdAt: d.humanize(data.createdAt),
    });
  };

  handleVoiceLanguageChanged = (locale) => {
    this.setState({
      locale,
    });
  };

  handleTriggerKeyboard = (voiceControl) => async () => {
    try {
      await voiceControl.stopListening();
      if (this.replyBar) {
        this.replyBar.focus();
      }
    } catch (e) {
      Alert.alert(e.toString);
      console.error(e);
    }
  };

  renderBackground = () => (
    <ImageBackground
      source={Images.voice.background}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: -100,
      }}
    />
  );

  renderStatusBar = () => (
    <MainNavBar
      rightComponent="NEXT"
      rightOnPress={() => {
        Actions.hereYouAre_topicList({
          hideTabBar: false,
          statusBarColor: Colors.paleGrey,
          type: 'jump',
        });
      }}
      leftComponent={null}
      style={styles.navBar}
    />
  );

  renderPictures = () => (
    <View>
      <Image
        source={Images.voice.welcome}
        style={{
          marginTop: 50,
        }}
      />
      <Image
        source={Images.voice.weo}
        style={{
          marginTop: 16,
          marginLeft: 8,
        }}
      />
    </View>
  );

  renderPickerListItem = (selected, item) => (
    <View
      style={{
        borderBottomWidth: 1,
        borderColor: Colors.gray,
      }}
    >
      <Text
        style={{
          fontWeight: selected.Name === item.Name ? 'bold' : '100',
          padding: 15,
        }}
      >
        {item.Name}
        {selected.Name === item.Name ? '✅' : ''}
      </Text>
    </View>
  );

  renderPickerModal = (locale) => (
    <PickerModal
      renderSelectView={(disabled, selected, showModal) => (
        <TouchableOpacity style={styles.selectedLanguage} onPress={showModal}>
          <IconButton
            iconName="language"
            iconType="MaterialIcons"
            iconColor={Colors.black}
            onPress={showModal}
          />
          <Text style={{}}>{SUPPORT_LANGUAGES().find((e) => e.Value === selected.Value).Name}</Text>
        </TouchableOpacity>
      )}
      renderListItem={this.renderPickerListItem}
      onSelected={this.handleVoiceLanguageChanged}
      items={SUPPORT_LANGUAGES()}
      selected={locale}
      searchPlaceholderText="Select your language"
      requireSelection
      autoSort
    />
  );

  renderAnimatedButton = ({ voiceControl }) => {
    const {
      currentNetworkInfo: { isInternetReachable },
    } = this.props;
    const { isButtonPressed, isPlay, animation } = this.state;
    return (
      <>
        <Text style={styles.wording}>{t('voice_anonymous_title1')}</Text>
        <LottieButton
          ref={this._getAnimatedButtonRef}
          onPressIn={this.onPressStartRecord(voiceControl)}
          onPressOut={this.onPressStopRecord(voiceControl)}
          style={styles.micButton}
          source={animation}
          autoPlay={isPlay}
          autoSize
          speed={1}
          loop={isPlay}
          disabled={!isInternetReachable || !isPlay || isButtonPressed}
          animationStyle={styles.micAnimation}
        />
        <Text>{t('voice_anonymous_title2')}</Text>
      </>
    );
  };

  renderReplyBar = ({ userCircle = {}, voiceInputText, voiceControl }) => (
    <SafeAreaView style={styles.replyBar}>
      <VoiceReplyBar
        ref={this._getReplyBarRef}
        currentCircleId={userCircle && userCircle.id}
        voiceInputText={voiceInputText}
        isListening={voiceControl.state.isListening}
        onCreateTopicSuccess={this.handleCreateTopicSuccess}
      />
    </SafeAreaView>
  );

  renderComponents =
    ({ isPlay, isButtonPressed, voiceInputText, userCircle, animation, locale, isDebug }) =>
    (voiceControl) =>
      (
        <DismissKeyboardView
          style={styles.container}
          keyboardVerticalOffset={Platform.select({
            ios: ifIphoneX(Screen.verticalScale(16), Screen.verticalScale(0)),
            android: Screen.verticalScale(4),
          })}
        >
          {this.renderStatusBar()}
          {this.renderPictures()}
          {this.renderAnimatedButton({ voiceControl })}
          {this.renderPickerModal(locale)}
          {this.renderReplyBar({ userCircle, voiceInputText, voiceControl })}
          {this.renderBackground()}
          {isDebug && <VoiceDebugView {...voiceControl.state} />}
        </DismissKeyboardView>
      );

  render() {
    const { userCircle, sceneKey } = this.props;
    const { isDebug, voiceInputText, locale } = this.state;
    return (
      <>
        <AndroidBackKey sceneKey={sceneKey} onBackKeyPress={Dialog.requestAndroidExitAppAlert} />
        <VoiceControl
          ref={this._getVoiceRef}
          onSpeechStart={this.onSpeechStart}
          onSpeechEnd={this.onSpeechEnd}
          onSpeechError={this.onSpeechEnd}
          onSpeechResults={this.onSpeechResults}
        >
          {this.renderComponents({
            voiceInputText,
            userCircle,
            isDebug,
            locale,
          })}
        </VoiceControl>
      </>
    );
  }
}

export default connect(
  (state, props) => ({
    sceneKey: props.name,
    routeName: state.appRoute.routeName,
    circle: state.circle,
    userCircle: state.circle.userCircle,
    hasMicrophonePermission: AppPermissionSelectors.hasThisPermission(Permission.MICROPHONE)(state),
    hasSpeechPermission: AppPermissionSelectors.hasThisPermission(Permission.SPEECH_RECOGNITION)(
      state,
    ),
    currentNetworkInfo: state.appState.currentNetworkInfo,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        onRootTabIndexChange: AppStateActions.onRootTabIndexChange,
      },
      dispatch,
    ),
)(VoiceScreen);
