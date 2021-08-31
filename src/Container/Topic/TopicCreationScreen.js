import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  TextInput,
  Platform,
  Keyboard,
  Image,
  Text,
  View,
  Alert,
} from 'react-native';
import { isString, isEmpty, debounce } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Config from '~/Config';
import { translate as t } from '~/Helpers/I18n';
import { Classes, Colors, Fonts, Images } from '~/Theme';
import { AppStateActions, TopicActions } from '~/Store';
import {
  Date as d,
  Dialog,
  Screen,
  StyleSheet,
  ListenableEvent,
  Content as ContentHelper,
} from '~/Helper';

import { PrimaryBtn } from '~/widget/RoundButton';
import { AvatarBlock, ModalCard, DismissKeyboardView } from '~/Component';
import { checkAndRequestPermission, permissionType } from '~/utils/permission';

const { BUTTON_DEBOUNCE, CREATE_TOPIC_PERIOD } = Config;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: Screen.scale(20),
    paddingBottom: Screen.scale(28),
    paddingHorizontal: Screen.scale(17),
    backgroundColor: Colors.whiteThree,
  },
  label: {
    fontSize: Screen.scale(20),
    fontWeight: '600',
    color: Colors.black,
  },
  titleBlock: {
    marginTop: Screen.scale(15),
    paddingLeft: Screen.scale(10),
  },
  titleInputWrapper: {
    marginTop: Screen.scale(10),
    paddingBottom: Screen.scale(8),
    ...Platform.select({
      ios: {
        borderBottomWidth: Screen.scale(1),
        borderColor: Colors.warmGreyTwo,
      },
    }),
  },
  titleInput: {
    fontSize: Screen.scale(18),
    fontWeight: '500',
    color: Colors.black,
    height: Screen.scale(48),
    borderColor: Colors.warmGreyTwo,
    backgroundColor: Colors.paleGrey50,
  },
  descBlock: {
    flex: 1,
    height: '100%',
    marginTop: Screen.scale(20),
    paddingLeft: Screen.scale(10),
  },
  descInput: {
    flex: 1,
    minHeight: Screen.verticalScale(120),
    fontSize: Screen.scale(18),
    fontWeight: '500',
    color: Colors.black,
    marginTop: Screen.scale(10),
    height: Screen.scale(300),
    width: '100%',
    textAlignVertical: 'top',
    backgroundColor: Colors.paleGrey50,
  },
  submitBtn: {
    width: Screen.width - Screen.scale(34),
  },
  descHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectImageButton: {
    marginLeft: Screen.scale(15),
  },
  uploadImageContainer: {
    height: Screen.scale(100),
    width: '100%',
    marginVertical: Screen.scale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadImage: {
    paddingVertical: Screen.scale(15),
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: Screen.scale(10),
    right: Screen.scale(25),
  },
  footer: {
    minHeight: Screen.scale(64),
    paddingHorizontal: Screen.scale(17),
    paddingBottom: Screen.verticalScale(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  hidden: {
    display: 'none',
  },
  btnRightTopSubmit: {
    backgroundColor: Colors.mainYellow,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16@s',
    height: '32@s',
    width: '64@s',
  },
  txtRightTopSubmit: {
    color: Colors.greyish,
    ...Fonts.style.regular500,
  },
  txtRightTopSubmitHasText: {
    color: Colors.black,
  },
});

class TopicCreationScreen extends React.Component {
  static propTypes = {
    // content type
    belongsTo: PropTypes.oneOf(['HERE_YOU_ARE', 'THERE_YOU_ARE']).isRequired,

    // loading
    isLoading: PropTypes.bool.isRequired,
    currentNetworkInfo: PropTypes.object.isRequired,

    // route
    prevRoute: PropTypes.string,
    routeName: PropTypes.string.isRequired,
    sceneKey: PropTypes.string.isRequired,

    // circle data
    userCircle: PropTypes.object,
    homeCircle: PropTypes.object,

    // user data
    lastCreateTopicAt: PropTypes.any,
    memberHash: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    memberId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    avatarKey: PropTypes.string.isRequired,

    // content
    fetchAddTopic: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lastCreateTopicAt: null,
    userCircle: {},
    homeCircle: {},
    belongsTo: 'HERE_YOU_ARE',
    nickname: 'Author',
    prevRoute: '',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.belongsTo === 'HERE_YOU_ARE') {
      if (!nextProps.userCircle) {
        return {
          ...prevState,
          circleId: null,
        };
      }
      if (prevState.circleId !== nextProps.userCircle.id) {
        return {
          ...prevState,
          circleId: nextProps.userCircle.id,
        };
      }
    }
    if (nextProps.belongsTo === 'THERE_YOU_ARE') {
      if (!nextProps.homeCircle) {
        return {
          ...prevState,
          circleId: null,
        };
      }
      if (prevState.circleId !== nextProps.homeCircle.id) {
        return {
          ...prevState,
          circleId: nextProps.homeCircle.id,
        };
      }
    }
    return null;
  }

  state = {
    circleId: null,
    title: null,
    content: null,
    selectedImage: null,
    uploadedImage: null,
    showKeyboard: false,
  };

  async componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      ListenableEvent.KEYBOARD_SHOW,
      this.keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      ListenableEvent.KEYBOARD_HIDE,
      this.keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow = () => {
    this.setState({ showKeyboard: true });
  };

  keyboardDidHide = () => {
    this.setState({ showKeyboard: false });
  };

  handleSubmit = debounce(async () => {
    const {
      currentNetworkInfo: { isInternetReachable },
      lastCreateTopicAt,
      belongsTo,
      userCircle,
      homeCircle,
    } = this.props;
    const { circleId, title, content } = this.state;

    // console.log('CREATE_TOPIC_PERIOD=>', CREATE_TOPIC_PERIOD);

    if (
      lastCreateTopicAt &&
      d.moment(lastCreateTopicAt).add(CREATE_TOPIC_PERIOD, 's') > d.moment()
    ) {
      return Dialog.createContentIntervalTooShortTooAlert(
        t('create_topic_interval_too_short', { period: CREATE_TOPIC_PERIOD }),
      );
    }
    if (isInternetReachable !== true || !isInternetReachable) {
      return Dialog.internetNotReachableAlert();
    }
    if (belongsTo === 'HERE_YOU_ARE' && !userCircle.id) {
      return Dialog.noCircleAlert();
    }
    if (belongsTo === 'THERE_YOU_ARE' && !homeCircle.id) {
      return Dialog.noCircleAlert();
    }
    if (!circleId) {
      return Dialog.noCircleAlert();
    }
    if (!ContentHelper.validateEmpty(title)) {
      return Alert.alert(t('create_topic_no_topic_title'));
    }
    const isContentLegal =
      ContentHelper.validateBlockWords(title) && ContentHelper.validateBlockWords(content);

    if (!isContentLegal) {
      return Dialog.containBlockedWordAlert(this.handleFetchAddTopic);
    } else {
      return this.handleFetchAddTopic();
    }
  }, BUTTON_DEBOUNCE);

  handleFetchAddTopic = () => {
    const { fetchAddTopic, belongsTo } = this.props;
    const { circleId, title, content, selectedImage } = this.state;
    console.log('this.state=>', this.state);

    return fetchAddTopic({
      title,
      content,
      circleId,
      belongsTo,
      selectedImage,
      onSuccess: () => {
        this.setState({
          title: null,
          content: null,
          selectedImage: null,
        });
      },
    });
  };

  hideKeyboard = () => {
    Keyboard.dismiss();
  };

  pickImageByLibrary = async () => {
    const havePermission = await checkAndRequestPermission(permissionType.photo);
    if (havePermission) {
      ImagePicker.openPicker({
        mediaType: 'photo',
      }).then(this.handleSelectedImage);
    }
  };

  pickImageByCamera = async () => {
    const havePermission = await checkAndRequestPermission(permissionType.camera);
    if (havePermission) {
      ImagePicker.openCamera({}).then(this.handleSelectedImage);
    }
  };

  handleSelectedImage = async (image) => {
    this.setState({
      selectedImage: image,
    });
  };

  removeSelectedImage = () => {
    this.setState({ selectedImage: null });
  };

  render() {
    const { nickname, avatarKey } = this.props;
    const { showKeyboard, title, content, selectedImage } = this.state;
    const hasTitle = isString(title) && !isEmpty(title.trim());
    return (
      <ModalCard
        title={t('create_topic_modal_title')}
        showBackButton
        rightComponent={
          <TouchableOpacity style={styles.btnRightTopSubmit} onPress={this.handleSubmit}>
            <Text style={[styles.txtRightTopSubmit, hasTitle && styles.txtRightTopSubmitHasText]}>
              {t('create_topic_submit')}
            </Text>
          </TouchableOpacity>
        }
      >
        <DismissKeyboardView
          style={styles.content}
          keyboardVerticalOffset={30}
          onPress={this.hideKeyboard}
          activeOpacity={1}
        >
          <AvatarBlock
            name={nickname}
            avatar={Images[avatarKey ? avatarKey.toLowerCase() : 'avatar1']}
          />
          <View style={styles.titleBlock}>
            <Text style={styles.label}>{t('create_topic_input_label_title')}</Text>
            <View style={styles.titleInputWrapper}>
              <TextInput
                autoFocus
                numberOfLines={1}
                placeholder={t('create_topic_max_word_length', { length: 30 })}
                placeholderTextColor={Colors.pinkishGrey}
                maxLength={30}
                // onEndEditing={evt => this.setState({ title: evt.nativeEvent.text })}
                onChangeText={(text) => this.setState({ title: text })}
                value={title}
                style={styles.titleInput}
                underlineColorAndroid="black"
              />
            </View>
          </View>
          <View style={styles.descBlock}>
            <View style={styles.descHeader}>
              <Text style={styles.label}>{t('create_topic_content_desc')}</Text>
              <View style={Classes.row}>
                <TouchableOpacity style={styles.selectImageButton} onPress={this.pickImageByCamera}>
                  <Icon name="add-a-photo" size={30} color={Colors.black} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.selectImageButton}
                  onPress={this.pickImageByLibrary}
                >
                  <Icon name="photo-library" size={30} color={Colors.black} />
                </TouchableOpacity>
              </View>
            </View>
            {Platform.OS === 'ios' && (
              <AutoGrowingTextInput
                placeholder={t('create_topic_max_word_length', {
                  length: 2000,
                })}
                multiline
                numberOfLines={5}
                maxLength={2000}
                // onEndEditing={evt => this.setState({ desc: evt.nativeEvent.text })}
                onChangeText={(text) => this.setState({ content: text })}
                placeholderTextColor={Colors.pinkishGrey}
                style={styles.descInput}
                value={content}
                underlineColorAndroid="transparent"
              />
            )}
            {Platform.OS === 'android' && (
              <TextInput
                placeholder={t('create_topic_max_word_length', {
                  length: 2000,
                })}
                multiline
                numberOfLines={5}
                maxLength={700}
                onChangeText={(text) => this.setState({ content: text })}
                placeholderTextColor={Colors.pinkishGrey}
                style={styles.descInput}
                value={content}
                underlineColorAndroid="transparent"
              />
            )}
          </View>
        </DismissKeyboardView>

        <View style={styles.footer}>
          {selectedImage && (
            <View style={[styles.uploadImageContainer, showKeyboard && styles.hidden]}>
              <Image
                source={{ uri: selectedImage.path }}
                style={[
                  styles.uploadImage,
                  {
                    height: Screen.scale(100),
                    width: Screen.scale((100 * selectedImage.width) / selectedImage.height),
                  },
                ]}
              />
              <TouchableOpacity style={styles.removeButton} onPress={this.removeSelectedImage}>
                <Icon name="cancel" size={30} color={Colors.black} />
              </TouchableOpacity>
            </View>
          )}
          <PrimaryBtn
            btnColor={Colors.mainYellow}
            textColor={hasTitle ? Colors.black : Colors.greyish}
            onPress={this.handleSubmit}
            text={t('create_topic_submit')}
            style={[styles.submitBtn, showKeyboard && styles.hidden]}
          />
        </View>
      </ModalCard>
    );
  }
}

export default connect(
  (state, props) => ({
    // loading
    isLoading: state.appState.isLoading,
    currentNetworkInfo: state.appState.currentNetworkInfo,

    // route
    sceneKey: props.name,
    prevRoute: state.appRoute.prevRoute,
    routeName: state.appRoute.routeName,

    // circle data
    homeCircle: state.circle.homeCircle,
    userCircle: state.circle.userCircle,

    // user data
    lastCreateTopicAt: state.user.lastCreateTopicAt,
    memberHash: state.user.profile.hash,
    nickname: state.user.profile.nickname,
    memberId: state.user.profile.memberId,
    username: state.user.profile.username,
    avatarKey: state.user.profile.avatarKey,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        fetchAddTopic: TopicActions.fetchAddTopic,
        updateLoading: AppStateActions.onLoading,
      },
      dispatch,
    ),
)(TopicCreationScreen);
