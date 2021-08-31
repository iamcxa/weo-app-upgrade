import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import { View, Text, Platform, FlatList, ScrollView } from 'react-native';

import { Colors, Fonts } from '~/Theme';
import { Permission, Screen } from '~/Helper';
import { translate as t } from '~/Helper/I18n';
import { Separator, BaseButton, LanguageModal } from '~/Component';
import { AppPermissionSelectors, AppConfigActions, UserActions } from '~/Store';

import styles from './PermissionScreenStyle';

class PermissionScreen extends React.Component {
  static propTypes = {
    hasHightGeolocationPermission: PropTypes.bool.isRequired,
    hasLowGeolocationPermission: PropTypes.bool.isRequired,
    hasNotificationPermission: PropTypes.bool.isRequired,
    hasMicrophonePermission: PropTypes.bool.isRequired,
    hasPhotoPermission: PropTypes.bool.isRequired,
    hasCameraPermission: PropTypes.bool.isRequired,
    hasSpeechPermission: PropTypes.bool.isRequired,
    fetchPostAutoSignUp: PropTypes.func.isRequired,
    onUserLocaleChange: PropTypes.func.isRequired,
    customLocale: PropTypes.string.isRequired,
    permissionRequired: PropTypes.array.isRequired,
    permissionOptional: PropTypes.array.isRequired,
  };

  state = {};

  componentDidMount() {
    __DEV__ && console.log('@Enter PermissionScreen');
  }

  checkPermission = (type) => {
    const {
      hasHightGeolocationPermission,
      hasLowGeolocationPermission,
      hasNotificationPermission,
      hasMicrophonePermission,
      hasPhotoPermission,
      hasCameraPermission,
      hasSpeechPermission,
    } = this.props;
    switch (type) {
      case 'location':
        return hasHightGeolocationPermission || hasLowGeolocationPermission;
      case 'notification':
        return hasNotificationPermission;
      case 'photo':
        return hasPhotoPermission;
      case 'camera':
        return hasCameraPermission;
      case 'speech':
        return Platform.select({
          ios: hasMicrophonePermission && hasSpeechPermission,
          android: hasMicrophonePermission,
        });

      default:
        return false;
    }
  };

  renderItem =
    (permissions) =>
    ({ item, index }) => {
      const hasPermission = this.checkPermission(item.type);
      return (
        <View style={styles.rowWrapper}>
          <Icon name={item.icon} size={Screen.scale(28)} style={styles.icon} color={Colors.black} />
          <View
            style={[styles.contentWrapper, index < permissions.length - 1 && styles.borderBottom]}
          >
            <View style={styles.txtWrapper}>
              <Text style={item.required ? Fonts.style.mediumBold : Fonts.style.medium400}>
                {t(`permission_item_title_${item.type}`)}
                {item.required && <Text style={styles.txtRequestStar}>*</Text>}
              </Text>
              <Text
                style={[Fonts.style.small, styles.txtSecondLine, item.required && Fonts.style.bold]}
              >
                {t(`permission_item_desc_${item.type}`)}
              </Text>
            </View>
            <BaseButton
              style={[styles.btnRequest, hasPermission && styles.btnHasPermission]}
              textColor={hasPermission ? Colors.pureWhite : Colors.dodgerblue}
              textStyle={Fonts.style.medium500}
              text={
                hasPermission ? t('permission_btn_request_success') : t('permission_btn_request')
              }
              onPress={item.onPress}
              disabled={hasPermission}
              throttleTime={0}
            />
          </View>
        </View>
      );
    };

  render() {
    const {
      hasHightGeolocationPermission,
      hasLowGeolocationPermission,
      fetchPostAutoSignUp,
      permissionRequired,
      permissionOptional,
      onUserLocaleChange,
      customLocale,
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.panel}>
          <View style={styles.headerWrapper}>
            <BaseButton
              style={styles.btnBase}
              textColor={Colors.dodgerblue}
              textStyle={Fonts.style.regular500}
              text={t('permission_btn_done')}
              disabled={!(hasHightGeolocationPermission || hasLowGeolocationPermission)}
              onPress={() => fetchPostAutoSignUp({ onSuccess: Actions.pop })}
              transparent
            />
          </View>
          <ScrollView>
            <FlatList
              renderItem={this.renderItem(permissionRequired)}
              keyExtractor={(item, index) => `${index}`}
              data={permissionRequired}
              ListHeaderComponent={
                <View style={styles.titleWrapper}>
                  <Text style={Fonts.style.input500}>{t('permission_nav_title')}</Text>
                </View>
              }
            />
            <Separator color={Colors.silverThree} fullWidth />
            <FlatList
              renderItem={this.renderItem(permissionOptional)}
              keyExtractor={(item, index) => `${index}`}
              data={permissionOptional}
              ListFooterComponent={
                <View style={styles.titleWrapper}>
                  <LanguageModal
                    onUserLocaleChange={onUserLocaleChange}
                    customLocale={customLocale}
                    fontSize="small"
                  />
                </View>
              }
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}

const { hasThisPermission } = AppPermissionSelectors;

export default connect(
  (state, props) => ({
    permissionRequired: [
      {
        type: 'location',
        icon: 'near-me',
        onPress: Permission.requestGeolocationPermission,
        required: true,
      },
    ],
    permissionOptional: [
      {
        type: 'notification',
        icon: 'bell',
        onPress: Permission.requestNotificationPermission,
      },
      {
        type: 'speech',
        icon: 'microphone-settings',
        onPress: Permission.requestMicrophonePermission,
      },
      {
        type: 'camera',
        icon: 'camera',
        onPress: Permission.requestCameraPermission,
      },
      {
        type: 'photo',
        icon: 'image-multiple',
        onPress: Permission.requestPhotoPermission,
      },
    ],
    customLocale: state.appConfig.customLocale,
    hasNotificationPermission: state.user.fcmToken,
    hasPhotoPermission: hasThisPermission(Permission.PHOTO)(state),
    hasCameraPermission: hasThisPermission(Permission.CAMERA)(state),
    hasMicrophonePermission: hasThisPermission(Permission.MICROPHONE)(state),
    hasSpeechPermission: hasThisPermission(Permission.SPEECH_RECOGNITION)(state),
    hasLowGeolocationPermission: hasThisPermission(Permission.GEOLOCATION_LOW)(state),
    hasHightGeolocationPermission: hasThisPermission(Permission.GEOLOCATION_HIGH)(state),
  }),
  (dispatch) =>
    bindActionCreators(
      {
        fetchPostAutoSignUp: UserActions.fetchPostAutoSignUp,
        onUserLocaleChange: AppConfigActions.onUserLocaleChange,
      },
      dispatch,
    ),
)(PermissionScreen);
