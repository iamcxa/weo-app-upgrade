import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
} from "react-native";
import { Actions, ActionConst } from "react-native-router-flux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import VersionNumber from "react-native-version-number";

import Config from "App/Config";
import { Colors } from "App/Theme";
import { Screen } from "App/Helpers";
import { AppConfigActions, AppStateActions } from "App/Stores";
import { BaseModalSelector } from "App/Components";
import { translate as t } from "App/Helpers/I18n";

import { H3, H4 } from "App/widget/Label";
import { cleanUser } from "App/Stores/User/Actions";

import i18n, { i18nKey } from "App/utils/i18n";
import { fetchAPI, apiHandler, apiAction } from "App/utils/api";
import * as fcm from "App/utils/fcm";

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    flex: 1,
    backgroundColor: Colors.transparent,
    justifyContent: "space-between",
    height: Screen.height,
    ...Platform.select({
      ios: {
        marginTop: Screen.moderateScale(-20),
      },
    }),
    paddingLeft: Screen.moderateScale(8),
    paddingBottom: Screen.moderateScale(32),
    // paddingTop: Screen.moderateScale(49)
  },
  item: {
    paddingBottom: Screen.moderateScale(22),
    fontWeight: "600",
  },
  appInfoText: {
    color: Colors.warmGrey,
    fontSize: Screen.moderateScale(12),
    lineHeight: parseInt(Screen.moderateScale(20), 10),
  },
});

const SUPPORT_LANGUAGES = () =>
  [
    { key: 0, label: t("drawer_content_select_prefer_locale"), section: true },
  ].concat(
    Config.UI_SUPPORT_LANGUAGES.map((lang) => ({
      label: t(`__support_language_${lang}`),
      key: lang,
    }))
  );

@connect(
  (state) => ({
    routes: state.appRoute,
    customLocale: state.appConfig.customLocale,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        cleanUser,
        updateLoading: AppStateActions.onLoading,
        onUserLocaleChange: AppConfigActions.onUserLocaleChange,
      },
      dispatch
    )
)
class DrawerContent extends React.Component {
  static propTypes = {
    onUserLocaleChange: PropTypes.func.isRequired,
    customLocale: PropTypes.string.isRequired,
    drawer: PropTypes.object,
  };

  static defaultProps = {};

  state = {
    languageModalShow: false,
  };

  onContactUs = () => {
    const contactMail = "admin@letsweo.com";
    const url = `mailto:${contactMail}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert(
            t("drawer_content_dialog_contact_us_by_mail", { mail: contactMail })
          );
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  logout = async () => {
    const { cleanUser, updateLoading } = this.props;
    Alert.alert(
      i18n.t(i18nKey.logoutTitle),
      i18n.t(i18nKey.logoutMsg),
      [
        { text: i18n.t(i18nKey.logoutCancel), onPress: () => {} },
        {
          text: i18n.t(i18nKey.logoutConfirm),
          onPress: async () => {
            try {
              updateLoading(true);
              const res = await fetchAPI(apiAction.LOGOUT, {
                platform: Platform.OS === "ios" ? "IOS_FCM" : "ANDROID",
                deviceToken: await fcm.getToken(),
              });
              await apiHandler({
                res,
                done: async (_res) => {
                  await AsyncStorage.clear();
                  // await removeItem(Storage.AUTHORIZATION);
                  Actions.intro({ type: ActionConst.RESET });
                  cleanUser();
                  updateLoading(false);
                  //   this.props.resetServices();
                  //   this.props.cleanTracking();
                },
                fail: () => {
                  updateLoading(false);
                },
              });
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  handleUserLanguageChanged = (option) => {
    const { onUserLocaleChange } = this.props;
    onUserLocaleChange(option.key);
  };

  renderLanguagePickerModal = () => {
    const { customLocale = "zh_HK" } = this.props;
    return (
      <BaseModalSelector
        visible={this.state.languageModalShow}
        data={SUPPORT_LANGUAGES()}
        onChange={this.handleUserLanguageChanged}
      >
        <TouchableOpacity>
          <H3 style={styles.item}>
            {t("drawer_content_setting_language")}(
            {t(`__support_language_${customLocale}`)})
          </H3>
        </TouchableOpacity>
      </BaseModalSelector>
    );
  };

  renderLanguageSelect = () => {
    this.setState({
      languageModalShow: true,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          {/*
          <TouchableOpacity onPress={() => Actions.signUp({ isUpdateMember: true })}>
            <H3 style={styles.item}>
              名樣
            </H3>
          </TouchableOpacity>
          */}
          <TouchableOpacity onPress={Actions.notifySetting}>
            <H3 style={styles.item}>
              {t("drawer_content_setting_notification")}
            </H3>
          </TouchableOpacity>

          {this.renderLanguagePickerModal()}

          <TouchableOpacity onPress={Actions.faq}>
            <H3 style={styles.item}>{t("drawer_content_setting_faq")}</H3>
          </TouchableOpacity>
          <TouchableOpacity onPress={Actions.privacy_view}>
            <H3 style={styles.item}>{t("drawer_content_setting_privacy")}</H3>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onContactUs}>
            <H3 style={styles.item}>{t("drawer_content_setting_contact")}</H3>
          </TouchableOpacity>
          {/*
            <TouchableOpacity onPress={this.logout}>
              <H3 style={styles.item}>
                重置
              </H3>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.logout}>
              <H3 style={styles.item}>{i18n.t(i18nKey.drawerLogout)}</H3>
            </TouchableOpacity>
          */}
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <H4
            style={styles.appInfoText}
          >{`Version ${VersionNumber.appVersion}(${VersionNumber.buildVersion})`}</H4>
          <H4 style={styles.appInfoText}>
            WaiThere Inc. {new Date().getFullYear()}
          </H4>
        </View>
      </View>
    );
  }
}

export default DrawerContent;
