import React from 'react';
import PropTypes from 'prop-types';
import Permissions from 'react-native-permissions';
import { connect } from 'react-redux';
import { isEmpty, isString } from 'lodash';
import { bindActionCreators } from 'redux';
import { StyleSheet, Platform, View } from 'react-native';

import { MainNavBar, SwitchListItem, AndroidBackKey } from '~/Component';
import { AppStateActions, UserActions } from '~/Stores';
import { translate as t } from '~/Helpers/I18n';
import { Screen, Dialog, Fcm } from '~/Helper';
import { Colors } from '~/Theme';

const Separator = (props) => <View style={styles.separator} />;

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: Colors.pureWhite,
  },
  separator: {
    width: Screen.scale(6),
    height: Screen.scale(20),
    // marginVertical: Screen.scale(10),
  },
});

class NotifySettingScreen extends React.Component {
  static propTypes = {
    fetchPutUserNotifyConfig: PropTypes.func.isRequired,
    updateUserStore: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired,
    fcmToken: PropTypes.string,
    currentState: PropTypes.string,
  };

  static defaultProps = {
    fcmToken: '',
    currentState: '',
    config: {
      hasCircleNotify: true,
      hasTopicNotify: false,
      hasPostNotify: false,
      hasReplyNotify: false,
    },
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      config: { hasCircleNotify },
      fcmToken,
    } = nextProps;
    if (hasCircleNotify !== prevState.hasCircleNotify) {
      return { hasCircleNotify };
    }
    if (!isEmpty(fcmToken) && isString(fcmToken)) {
      return { pushSetting: true };
    }
    if (isEmpty(fcmToken) || !fcmToken) {
      return { pushSetting: false };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const pushSetting = !isEmpty(props.fcmToken) || isString(props.fcmToken);
    this.state = {
      pushSetting,
      hasCircleNotify: true,
    };
  }

  componentDidMount() {
    const { fcmToken } = this.props;
    console.log('componentDidMount fcmToken=>', fcmToken);
    // if (!fcmToken) {
    //   Dialog.requestFcmPermissionAlert();
    // }
  }

  async componentDidUpdate(prevProps, prevState) {
    const { currentState, fcmToken, updateUserStore, fetchPutUserNotifyConfig } = this.props;
    console.log('currentState=>', currentState);
    console.log('fcmToken=>', fcmToken);
    if (
      currentState !== prevProps.currentState &&
      currentState === 'active'
      // &&
      // Platform.OS === 'ios'
    ) {
      const hasPermission = await Fcm.hasPermission();
      console.log('hasPermission=>', hasPermission);
      if (hasPermission && !fcmToken && prevProps.fcmToken) {
        Dialog.requestFcmPermissionAlert();
      } else if (!hasPermission && fcmToken) {
        updateUserStore({ fcmToken: null });
      } else if (!hasPermission && fcmToken) {
        updateUserStore({ fcmToken: null });
      }
    }
    if (!fcmToken && prevProps.fcmToken) {
      fetchPutUserNotifyConfig({
        deviceInfo: {
          fcmToken: false,
        },
      });
    }
  }

  onPushSettingChanged = () => {
    const { fcmToken, updateUserStore, fetchPutUserNotifyConfig } = this.props;
    if (!fcmToken) {
      Dialog.requestFcmPermissionAlert({
        onSuccess: (newToken) => {
          fetchPutUserNotifyConfig({
            deviceInfo: {
              fcmToken: newToken,
            },
          });
        },
      });
    } else {
      if (Platform.OS === 'ios') {
        Permissions.openSettings();
      } else {
        updateUserStore({ fcmToken: null });
        // fetchPutUserNotifyConfig({
        //   deviceInfo: {
        //     fcmToken: false,
        //   },
        // });
      }
    }
  };

  onCircleSettingPress = () =>
    this.handleSubmitConfig({
      hasCircleNotify: !this.state.hasCircleNotify,
    });

  handleSubmitConfig = ({ hasCircleNotify }) => {
    const { fetchPutUserNotifyConfig } = this.props;
    fetchPutUserNotifyConfig({ hasCircleNotify });
  };

  render() {
    const { hasCircleNotify, pushSetting } = this.state;
    return (
      <View style={styles.container}>
        <MainNavBar
          showLeftBlock={false}
          title={t('notify_setting_nav_bar_title')}
          style={styles.navBar}
        />
        <AndroidBackKey backTo="profile_view" />
        <Separator />

        <SwitchListItem
          title={t('notify_setting_push_notification')}
          description={t('notify_setting_push_notification_desc')}
          value={pushSetting}
          onValueChange={this.onPushSettingChanged}
          style={{ marginBottom: Screen.scale(20) }}
        />

        <SwitchListItem
          title={t('notify_setting_switch_list_circle_notification')}
          description={t('notify_setting_switch_list_circle_notification_desc')}
          value={hasCircleNotify}
          onValueChange={this.onCircleSettingPress}
        />
      </View>
    );
  }
}

export default connect(
  (state, props) => ({
    config: state.user.config,
    fcmToken: state.user.fcmToken,
    currentState: state.appState.currentState,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        fetchPutUserNotifyConfig: UserActions.fetchPutUserNotifyConfig,
        updateUserStore: UserActions.updateUserStore,
        updateLoading: AppStateActions.onLoading,
      },
      dispatch,
    ),
)(NotifySettingScreen);
