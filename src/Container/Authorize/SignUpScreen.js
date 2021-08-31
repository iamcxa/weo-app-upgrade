import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Image,
  Alert,
  Keyboard,
  Animated,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty, throttle } from 'lodash';
import { Actions } from 'react-native-router-flux';

import {
  MainNavBar,
  FooterLogo,
  AndroidBackKey,
  DismissKeyboardView as AvoidingView,
} from '~/Component';
import {
  Dialog,
  Screen,
  ifIphoneX,
  Fcm as FcmHelper,
  User as UserHelper,
  Content as ContentHelper,
} from '~/Helper';
import { translate as t } from '~/Helper/I18n';
import { Classes, Images, Colors } from '~/Theme';
import { UserActions } from '~/Store';
import Config from '~/Config';

import { checkForm } from '~/utils/form';
import { Title } from '~/widget/Label';
import { PrimaryBtn } from '~/widget/RoundButton';
import BottomPopup from '~/widget/BottomPopup';

import SelectAvatar from './SelectAvatarScreen';
import styles from './SignUpScreenStyle';

const { BUTTON_THROTTLE } = Config;

class SignUp extends React.Component {
  static propTypes = {
    isUpdateMember: PropTypes.bool,
    profile: PropTypes.object,
    apiToken: PropTypes.string,
    fcmToken: PropTypes.string,

    fetchPutUserProfile: PropTypes.func.isRequired,
    fetchPostSignUp: PropTypes.func.isRequired,
    updateUserStore: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isUpdateMember: false,
    profile: {},
    apiToken: '',
    fcmToken: '',
  };

  constructor(props) {
    super(props);
    const { profile: { avatarKey = null, nickname = '' } = {} } = props;
    const avatarId = avatarKey ? parseInt(avatarKey && avatarKey.split('Avatar')[1], 10) : null;
    this.state = {
      name: nickname,
      isLoginBtnOnPress: false,
      avatarId,
      avatarSource: Images[`avatar${avatarId}`] || null,
    };
    this.logoHeight = new Animated.Value(Screen.moderateScale(49.5 * 2));
    this.logoWidth = new Animated.Value(Screen.moderateScale(135.5 * 2));
    this.backgroundImagePosition = new Animated.Value(0);
  }

  componentDidMount() {
    const { fcmToken } = this.props;
    if (!fcmToken) {
      Dialog.requestFcmPermissionAlert();
    }

    const { isUpdateMember } = this.props;
    if (!isUpdateMember) {
      // 自動取得暱稱
      this.onBtnRandomPress();
    }
  }

  componentWillUnmount() {
    // this.keyboardHideSub.remove();
    // if (this.notificationListener) {
    //   this.notificationListener.remove();
    // }
    if (Platform.OS === 'ios') {
      // NotificationsIOS.removeEventListener('notificationOpened');
    }
  }

  onSelect = ({ avatarId, avatarSource }) => {
    this.setState({ avatarId, avatarSource });
    this.BottomPopup.close();
  };

  onAvatarPress = () => {
    Keyboard.dismiss();
    Actions.SelectAvatarScreen({ onSelect: this.onSelect });
    // this.BottomPopup.open();
  };

  onBtnRandomPress = throttle(async () => {
    Keyboard.dismiss();

    const randomAvatarId = UserHelper.getRandomSeed(12);

    // console.log('onBtnRandomPress=>', randomAvatarId);
    this.setState({
      avatarId: randomAvatarId,
      avatarSource: Images[`avatar${randomAvatarId}`],
      name: UserHelper.getRandomNickName(),
    });
  }, BUTTON_THROTTLE);

  onBtnLoginPress = throttle(async () => {
    Keyboard.dismiss();
    // check field
    if (!ContentHelper.validateEmpty(this.state.name)) {
      return Alert.alert(t('__error'), t('signup_set_image_and_name'));
    }
    // check block words
    const isValid = await ContentHelper.validateBlockWords(this.state.name);
    if (!isValid) {
      Dialog.containBlockedWordAlert(this.submitHandler);
    } else {
      await this.submitHandler();
    }
  }, BUTTON_THROTTLE);

  submitHandler = () => {
    const { fetchPutUserProfile, fetchPostSignUp, isUpdateMember } = this.props;
    const data = {
      avatarKey: `Avatar${this.state.avatarId || Math.random() * 12 + 1}`,
      identifier: `${new Date().getTime()}-${Math.floor(Math.random() * 100 + 1)}`,
      nickname: this.state.name,
    };
    console.log('data=>', data);
    if (isUpdateMember) {
      fetchPutUserProfile(data);
    } else {
      fetchPostSignUp(data);
    }
  };

  checkForm = () => {
    const checkFormStatus = checkForm([this.nameInput]);
    this.setState({
      isLoginBtnOnPress: checkFormStatus,
    });
  };

  render() {
    const { isUpdateMember, profile: { nickname } = {} } = this.props;
    const { avatarId } = this.state;
    return (
      <View style={Classes.fill}>
        {isUpdateMember && (
          <>
            <MainNavBar style={styles.navBar} leftComponent="cancel" />
            <AndroidBackKey backTo="profile_view" />
          </>
        )}
        <View style={styles.container}>
          <View style={styles.skewed} />
          <AvoidingView
            behavior={Platform.select({
              android: 'height',
              ios: 'padding',
            })}
            keyboardVerticalOffset={Platform.select({
              ios: 0,
              android: Screen.scale(-32),
            })}
          >
            <View style={styles.titleContainer}>
              <Title style={styles.titleText}>
                {avatarId === null
                  ? t('signup_press_to_pickup_image')
                  : t('signup_press_to_update_image')}
              </Title>
              <TouchableOpacity style={styles.selectAvatar} onPress={this.onAvatarPress}>
                {avatarId === null ? (
                  <Icon name="plus" size={Screen.moderateScale(40)} color={Colors.black} />
                ) : (
                  <Image source={Images[`avatar${avatarId}`]} style={styles.avatarImage} />
                )}
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.6 }}>
              <View style={{ alignItems: 'center' }}>
                <Title style={styles.inputLabel}>{t('signup_set_new_name')}</Title>
                <TextInput
                  style={styles.nameInput}
                  defaultValue={nickname}
                  onChangeText={(name) => this.setState({ name }, this.checkForm)}
                  maxLength={10}
                  placeholder={t('signup_anonymous_placeholder')}
                  placeholderTextColor={Colors.pinkishGrey}
                  underlineColorAndroid="transparent"
                  ref={(ref) => {
                    this.nameInput = ref;
                  }}
                  value={this.state.name}
                  isRequire
                />
              </View>
            </View>
            <View style={styles.primaryBtnContainer}>
              <PrimaryBtn
                onPress={this.onBtnLoginPress}
                text={t('signup_confirm_profile_start')}
                style={styles.startBtn}
                textStyle={styles.startBtnText}
              />
              <PrimaryBtn
                onPress={this.onBtnRandomPress}
                text={t('signup_random_profile')}
                style={[styles.startBtn, styles.btnRandomName]}
                textColor={Colors.black}
                textStyle={styles.startBtnText}
              />
            </View>
          </AvoidingView>
          <FooterLogo />
          <BottomPopup
            // animateDuration={ANIMATE_DURATION}
            // maskOpacity={0.1}
            ref={(ref) => {
              this.BottomPopup = ref;
            }}
          >
            <SelectAvatar
              onSelect={this.onSelect}
              onClose={() => {
                this.BottomPopup.close();
              }}
            />
          </BottomPopup>
        </View>
      </View>
    );
  }
}

export default connect(
  (state, params) => ({
    profile: state.user.profile,
    fcmToken: state.user.fcmToken,
    apiToken: state.user.apiToken,
    isUpdateMember: params.isUpdateMember,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        updateUserStore: UserActions.updateUserStore,
        fetchPostSignUp: UserActions.fetchPostSignUp,
        fetchPutUserProfile: UserActions.fetchPutUserProfile,
      },
      dispatch,
    ),
)(SignUp);
