import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { isString, isEmpty, debounce } from 'lodash';
import { bindActionCreators } from 'redux';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
  Alert,
  Image,
  View,
  Text,
} from 'react-native';

import {
  ScaledSheet,
  ifIphoneX,
  Dialog,
  Screen,
  Date as d,
  Content as ContentHelper,
} from '~/Helper';
import { Colors, Metrics, Fonts, Classes } from '~/Theme';
import { AppStateActions, TopicActions } from '~/Store';
import { translate as t } from '~/Helpers/I18n';
import Config from '~/Config';

import { fetchAPI, apiAction } from '../utils/api';
import { validateEmpty, validateBlockWords } from '../utils/input';

import { compressImage } from '../utils/image';
import { checkAndRequestPermission, permissionType } from '../utils/permission';

const { BUTTON_DEBOUNCE, CIRCLE_TYPE, CREATE_TOPIC_PERIOD, CREATE_POST_PERIOD } = Config;

const HIT_SLOP_5 = {
  top: 5,
  left: 5,
  right: 5,
  bottom: 5,
};

const HIT_SLOP_10 = {
  top: 10,
  left: 10,
  right: 10,
  bottom: 10,
};

const styles = ScaledSheet.create({
  containerWrapper: {
    ...Classes.center,
    ...Platform.select({
      ios: {
        ...ifIphoneX(
          {
            marginBottom: Metrics.baseMargin / 2,
          },
          {
            marginBottom: Metrics.baseMargin / 2,
          },
        ),
      },
      android: {
        marginBottom: 0,
      },
    }),
  },
  containerWrapperFocused: {
    ...Platform.select({
      ios: {
        ...ifIphoneX(
          {
            marginBottom: 0,
          },
          {
            marginBottom: 0,
            paddingBottom: 0,
          },
        ),
      },
      android: {
        marginBottom: 0,
        paddingBottom: 0,
      },
    }),
  },
  containerWrapperUnfocused: {
    minHeight: Metrics.REPLY_BAR_HEIGHT,
    ...Platform.select({
      ios: {
        paddingBottom: ifIphoneX(Metrics.baseMargin, 0),
      },
      android: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    }),
  },
  container: {
    borderTopWidth: '1@vs',
    borderColor: Colors.mainYellow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Metrics.baseMargin * 2,
    paddingBottom: Metrics.baseMargin,
    width: Screen.width,
    ...Platform.select({
      ios: ifIphoneX(
        {
          marginBottom: Metrics.baseMargin * 2,
        },
        {
          marginBottom: 0,
        },
      ),
    }),
  },
  textInputPlaceHolder: {
    color: Colors.red,
    textAlignVertical: 'center',
  },
  textInputBase: {
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    fontSize: Fonts.size.input,
    letterSpacing: Screen.scale(-0.36),
    color: Colors.blackFour,
    marginVertical: Metrics.baseMargin,
    marginRight: Metrics.baseMargin / 4,
    marginLeft: Metrics.baseMargin / 1.5,
    paddingHorizontal: Metrics.baseMargin / 2,
    backgroundColor: Colors.silverFour,
    borderRadius: Metrics.baseMargin,
    paddingTop: Metrics.baseMargin,
    paddingBottom: Metrics.baseMargin,
  },
  textInputFocused: {
    ...Platform.select({
      ios: {
        marginBottom: Metrics.baseMargin,
      },
      android: {
        paddingTop: 0,
        paddingBottom: Metrics.baseMargin / 4,
      },
    }),
  },
  textInputUnfocused: {
    ...Platform.select({
      android: {
        lineHeight: Metrics.REPLY_BAR_HEIGHT / 2,
        height: Metrics.REPLY_BAR_HEIGHT / 2,
        paddingTop: 0,
        paddingBottom: Metrics.baseMargin / 4,
      },
    }),
  },
  button: {
    marginTop: Metrics.baseMargin / 4.5,
    marginLeft: Metrics.baseMargin * 0.5,
    justifyContent: 'center',
    height: '100%',
    ...Platform.select({
      android: {
        marginBottom: Metrics.baseMargin / 2,
      },
    }),
  },
  selectImageRow: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: Metrics.REPLY_BAR_HEIGHT,
    flexDirection: 'row',
  },
  selectImageIcon: {
    marginLeft: Metrics.baseMargin / 4,
  },
  selectedImage: {
    maxWidth: Screen.scale(Screen.width / 3),
  },
  txtContentExceedMaxLength: {
    fontSize: Fonts.size.small,
    color: Colors.error,
    position: 'absolute',
    bottom: Metrics.baseMargin * 1.5,
    right: Metrics.baseMargin * 5.25,
  },

  btnClearContent: {
    position: 'absolute',
    bottom: Metrics.baseMargin * 1.5,
    left: Metrics.baseMargin * 5.25,
  },
  txtClearContent: {
    fontSize: Fonts.size.small,
    color: Colors.greyishBrown,
  },
  replyToAuthorBlockStyle: {
    position: 'absolute',
    top: Platform.select({
      ios: Metrics.baseMargin / 1.5,
      android: Metrics.baseMargin / 2,
    }),
    left: Platform.select({
      ios: ifIphoneX(Screen.scale(18), Screen.scale(18)),
      android: Screen.scale(18.5),
    }),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.transparent,
    zIndex: 100,
  },
  txtReplyToAuthor: {
    fontSize: Fonts.size.regular,
    color: Colors.greyishBrown,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // backgroundColor: Colors.transparentblue,
  },
});

let isComponentMounted = false;

class ReplyBar extends React.PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['TOPIC', 'POST', 'REPLY']).isRequired,
    updateLoading: PropTypes.func.isRequired,
    replyToAuthorName: PropTypes.string,
    disableUploadImage: PropTypes.bool,
    onReplySuccess: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    appendContent: PropTypes.string,
    content: PropTypes.string,
    style: PropTypes.object,
    id: PropTypes.string,
    fetchAddTopic: PropTypes.func.isRequired,
    fetchPostTopicPost: PropTypes.func.isRequired,
    fetchReplyPostPost: PropTypes.func.isRequired,
    onRemoveReplyToAuthorName: PropTypes.func,
    topicId: PropTypes.string,
    disabled: PropTypes.bool,
    userCircle: PropTypes.object,
    homeCircle: PropTypes.object,
    maxLength: PropTypes.number,
    maxTextInputLines: PropTypes.number,
    allowPhotoWithEmptyContent: PropTypes.bool,
    belongsTo: PropTypes.string,
    lastCreateTopicAt: PropTypes.any,
    lastCreatePostAt: PropTypes.any,
  };

  static defaultProps = {
    lastCreateTopicAt: null,
    lastCreatePostAt: null,
    disableUploadImage: false,
    refreshTextInput: false,
    replyToAuthorName: '',
    onReplySuccess: null,
    appendContent: '',
    content: '',
    style: {},
    onBlur: null,
    onFocus: null,
    id: null,
    userCircle: {},
    homeCircle: {},
    disabled: false,
    maxLength: 500,
    maxTextInputLines: 7,
    allowPhotoWithEmptyContent: false,
    onRemoveReplyToAuthorName: () => {},
  };

  state = {
    showLeftBlock: false,
    onReplySuccess: null,
    uploadedImage: null,
    selectedImage: null,
    refreshing: false,
    isFocused: false,
    content: '',
    keyboardHeight: 0,
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

    isComponentMounted = true;
  }

  componentDidUpdate(prevProps, prevState) {
    const { content, maxLength, appendContent, replyToAuthorName } = this.props;
    if (isComponentMounted) {
      if (content !== prevProps.content && content !== '' && !prevState.content) {
        this.setState({ content });
      }
      if (appendContent !== prevProps.appendContent && appendContent) {
        this.setState({
          content: `${prevState.content}${
            prevState.content.trim() !== '' ? ', ' : ''
          }${appendContent}`,
        });
      }
      if (replyToAuthorName !== prevProps.replyToAuthorName) {
        if (this.props.onFocus) {
          this.props.onFocus();
        }
      }
    }
  }

  componentWillUnmount() {
    isComponentMounted = false;
  }

  _keyboardDidShow = (e) => {
    this.setState({
      keyboardHeight: e.endCoordinates.height,
    });
  };

  _keyboardDidHide = (e) => {
    this.setState({
      keyboardHeight: 0,
    });
  };

  onChangeText = (text) => {
    const { maxTextInputLines } = this.props;
    const lines = text.split('\n');

    if (lines.length < maxTextInputLines) {
      this.setState((prevState) => ({
        ...prevState,
        content: text,
      }));
    }
  };

  onFocus = () => {
    const { content = '' } = this.state;
    const { onFocus, replyToAuthorName = '' } = this.props;
    if (onFocus) {
      onFocus();
    }
    // set replying author name prefix
    // if (!content || !content.includes(replyToAuthorName)) {
    //   this.setState({
    //     content: `${replyToAuthorName} ${content}`,
    //   });
    // }
    this.setState({ isFocused: true });
  };

  onBlur = () => {
    this.setState({
      isFocused: false,
      showLeftBlock: false,
    });
    console.log('onBlur!');
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur();
    }
  };

  // eslint-disable-next-line consistent-return
  onSubmit = debounce(async () => {
    Keyboard.dismiss();
    const { belongsTo, userCircle, allowPhotoWithEmptyContent } = this.props;
    if (belongsTo === CIRCLE_TYPE.HERE_YOU_ARE && isEmpty(userCircle)) {
      return Dialog.noCircleAlert();
    }
    const { content } = this.state;
    if (!allowPhotoWithEmptyContent && !validateEmpty(content)) {
      Alert.alert(t('__alert_reply_bar_type_empty'));
      this.props.updateLoading(false);
      return null;
    }
    this.props.updateLoading(true);
    // check block words
    const isValid = await validateBlockWords(content);
    this.props.updateLoading(false);
    if (!isValid) {
      Alert.alert(t('__alert_reply_bar_message_content_not_allowed'), null, [
        {
          text: 'cancel',
          onPress: () => {},
        },
        {
          text: 'Send',
          onPress: async () => {
            await this.sendReply();
          },
        },
      ]);
    } else {
      this.sendReply();
    }
  }, BUTTON_DEBOUNCE);

  getContent = () => this.state.content;

  focus = () => {
    this.input.focus();
  };

  blur = () => {
    this.input.blur();
  };

  sendReply = async () => {
    const {
      id,
      type,
      topicId,
      belongsTo,
      homeCircle,
      userCircle,
      replyToAuthorName,
      fetchAddTopic,
      fetchPostTopicPost,
      fetchReplyPostPost,
      lastCreateTopicAt,
      lastCreatePostAt,
    } = this.props;
    const { content, selectedImage, uploadedImage } = this.state;
    const data = {
      title: type === 'TOPIC' ? content.replace(replyToAuthorName, '') : null,
      circleId: belongsTo === CIRCLE_TYPE.HERE_YOU_ARE ? userCircle.id : homeCircle.id,
      content: content.replace(replyToAuthorName, ''),
      selectedImage,
    };
    if (isEmpty(uploadedImage)) {
      delete data.media;
    }
    const replySuccess = (res) => {
      this.props.onReplySuccess(res, id, type);
    };

    if (!ContentHelper.validateBlockWords(content)) {
      return Dialog.containBlockedWordAlert(this.handleFetchAddTopic);
    }
    if (
      type === 'TOPIC' &&
      lastCreateTopicAt &&
      d.moment(lastCreateTopicAt).add(CREATE_TOPIC_PERIOD, 's') > d.moment()
    ) {
      return Dialog.createContentIntervalTooShortTooAlert(
        t('create_topic_interval_too_short', { period: CREATE_TOPIC_PERIOD }),
      );
    }
    if (
      type !== 'TOPIC' &&
      lastCreatePostAt &&
      d.moment(lastCreatePostAt).add(CREATE_POST_PERIOD, 's') > d.moment()
    ) {
      return Dialog.createContentIntervalTooShortTooAlert(
        t('create_topic_interval_too_short', { period: CREATE_POST_PERIOD }),
      );
    }
    // console.log('type =>', type);
    // console.log('data =>', data);
    this.input.blur();
    if (type === 'TOPIC') {
      fetchAddTopic({
        title: data.title,
        content: data.content,
        circleId: data.circleId,
        belongsTo: belongsTo || CIRCLE_TYPE.HERE_YOU_ARE,
        selectedImage,
        onSuccess: replySuccess,
      });
    } else if (type === 'REPLY') {
      fetchReplyPostPost(id, data, replySuccess);
    } else {
      fetchPostTopicPost(topicId, data, replySuccess);
    }
    this.setState(
      {
        content: '',
        refreshTextInput: true,
        selectedImage: null,
        uploadedImage: null,
      },
      () => {
        this.setState({ refreshTextInput: false });
      },
    );
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

  showLeftBlock = () => {
    this.setState({
      showLeftBlock: true,
    });
  };

  uploadImage = async (selectedImage) => {
    if (selectedImage) {
      const compressedImage = await compressImage(selectedImage);
      const { mime, filename } = selectedImage;
      const res = await fetchAPI(apiAction.UPLOAD_IMAGE, {
        file: {
          uri: compressedImage.uri,
          type: mime,
          name: filename || 'image',
        },
      });
      console.log('uploadImage res=>', res);
      return res.data.files[0];
    }
    return null;
  };

  removeSelectedImage = () => {
    this.setState({ selectedImage: null });
  };

  renderComponents = () => {
    const { isFocused, showLeftBlock, selectedImage } = this.state;
    const imageSelected = () => (
      <TouchableOpacity onPress={this.removeSelectedImage}>
        <Image
          source={{ uri: selectedImage.path }}
          style={[
            styles.selectedImage,
            {
              height: Screen.scale(35),
              width: Screen.scale((35 * selectedImage.width) / selectedImage.height),
            },
          ]}
        />
      </TouchableOpacity>
    );
    const imageNotSelect = () => (
      <View style={[Classes.row, Classes.mainStart, Classes.mainSpaceBetween, { width: 52 }]}>
        <TouchableOpacity
          key="camera"
          style={styles.selectImageIcon}
          onPress={this.pickImageByCamera}
          hitSlop={HIT_SLOP_5}
        >
          <MaterialIcon name="add-a-photo" size={23} color={Colors.black} />
        </TouchableOpacity>
        <TouchableOpacity
          key="library"
          style={styles.selectImageIcon}
          onPress={this.pickImageByLibrary}
          hitSlop={HIT_SLOP_5}
        >
          <MaterialIcon name="photo-library" size={23} color={Colors.black} />
        </TouchableOpacity>
      </View>
    );
    return !isFocused || showLeftBlock ? (
      <View style={[styles.selectImageRow, Classes.mainStart]}>
        {selectedImage ? imageSelected() : imageNotSelect()}
      </View>
    ) : (
      <View style={styles.selectImageRow}>
        <TouchableOpacity
          key="library"
          style={styles.button}
          onPress={this.showLeftBlock}
          hitSlop={HIT_SLOP_5}
        >
          <Icon name="ios-arrow-dropright-circle" size={Screen.scale(24)} color={Colors.black} />
        </TouchableOpacity>
      </View>
    );
  };

  renderReplyToAuthorBlock = () => {
    const { onRemoveReplyToAuthorName, replyToAuthorName } = this.props;
    return (
      !isEmpty(replyToAuthorName) && (
        <TouchableOpacity
          onPress={onRemoveReplyToAuthorName}
          style={styles.replyToAuthorBlockStyle}
        >
          <MaterialIcon
            name="cancel"
            size={Screen.scale(24)}
            color={Colors.greyishBrown}
            style={{ marginRight: Metrics.baseMargin / 2 }}
          />
          <Text style={styles.txtReplyToAuthor}>
            {t('__reply_to')}
            {replyToAuthorName}
          </Text>
        </TouchableOpacity>
      )
    );
  };

  render() {
    const {
      style,
      disabled,
      disableUploadImage,
      maxLength,
      maxTextInputLines,
      replyToAuthorName,
      allowPhotoWithEmptyContent,
    } = this.props;
    const { selectedImage, keyboardHeight, isFocused, refreshTextInput, content } = this.state;
    const contentInputted =
      (typeof content === 'string' && content.trim().length > 0) ||
      (allowPhotoWithEmptyContent && selectedImage);
    const contentLines = content.split('\n').length;
    const contentLinesHeight = Metrics.REPLY_BAR_HEIGHT * maxTextInputLines;
    const maxDisplayAreaHeight = Platform.select({
      ios: ifIphoneX(
        Screen.height - keyboardHeight - Screen.scale(96),
        Screen.height - keyboardHeight - Screen.scale(96),
      ),
      android: Screen.height - keyboardHeight - Screen.scale(56),
    });
    const isContentLongerThanScreenHeight = contentLinesHeight > maxDisplayAreaHeight;
    const maxInputHeight = isContentLongerThanScreenHeight
      ? maxDisplayAreaHeight
      : contentLinesHeight;

    const isContentTooLong = isString(content) && content.length >= maxLength;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (this.input) {
            this.input.focus();
          }
        }}
      >
        <View style={styles.containerWrapper}>
          <View
            style={[
              styles.container,
              style,
              !isEmpty(replyToAuthorName) && {
                paddingTop: Metrics.baseMargin * 3,
                paddingBottom: Metrics.baseMargin * 2,
              },
              isFocused ? styles.containerWrapperFocused : styles.containerWrapperUnfocused,
              isContentTooLong && { marginBottom: Metrics.baseMargin * 1.5 },
              replyToAuthorName && { paddingTop: Metrics.baseMargin * 2 },
            ]}
          >
            {this.renderReplyToAuthorBlock()}
            {!disableUploadImage ? this.renderComponents() : null}
            {!refreshTextInput && (
              <AutoGrowingTextInput
                ref={(ref) => {
                  this.input = ref;
                }}
                placeholder={t('reply_bar_placeholder')}
                ellipsizeMode="head"
                maxLength={maxLength}
                maxHeight={
                  isFocused
                    ? maxInputHeight
                    : contentLines > 1
                    ? Metrics.REPLY_BAR_HEIGHT * contentLines + 1
                    : Metrics.REPLY_BAR_HEIGHT / 2
                }
                value={content.substring(0, maxLength - 1)}
                onChangeText={this.onChangeText}
                style={[
                  styles.textInputBase,
                  isFocused ? styles.textInputFocused : styles.textInputUnfocused,
                ]}
                underlineColorAndroid="transparent"
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                enableScrollToCaret
              />
            )}
            {contentInputted && (
              <TouchableOpacity
                disabled={disabled}
                style={styles.button}
                onPress={async () => {
                  if (!disabled) {
                    if (this.inputWrapper && this.inputWrapper.forceBlur) {
                      this.inputWrapper.forceBlur();
                    }
                    await this.onSubmit();
                  }
                }}
                hitSlop={HIT_SLOP_10}
              >
                <Icon
                  name="ios-send"
                  size={Screen.scale(24)}
                  color={disabled ? Colors.steel : Colors.black}
                />
              </TouchableOpacity>
            )}
            {isContentTooLong && (
              <Text
                style={[
                  styles.txtContentExceedMaxLength,
                  isString(content) && content.length > 1 && { bottom: 0 },
                ]}
              >
                {t('text_input_max_length', { max: maxLength })}
              </Text>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default connect(
  (state) => ({
    circle: state.circle,
    userCircle: state.circle.userCircle,
    homeCircle: state.circle.homeCircle,
    lastCreateTopicAt: state.user.lastCreateTopicAt,
    lastCreatePostAt: state.user.lastCreatePostAt,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        updateLoading: AppStateActions.onLoading,
        fetchPostTopicPost: TopicActions.fetchPostTopicPost,
        fetchAddTopic: TopicActions.fetchAddTopic,
        fetchReplyPostPost: TopicActions.fetchReplyPostPost,
      },
      dispatch,
    ),
  null,
  { forwardRef: true },
)(ReplyBar);
