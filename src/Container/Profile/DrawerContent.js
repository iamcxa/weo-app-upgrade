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

import Config from "~/Config";
import { Colors } from "~/Theme";
import { Screen } from "~/Helper";
import { AppConfigActions, AppStateActions } from "~/Store";
import { BaseModalSelector } from "~/Component";
import { translate as t } from "~/Helper/I18n";

import { H3, H4 } from "~/widget/Label";
import { cleanUser } from "~/Store/User/Actions";

import i18n, { i18nKey } from "~/utils/i18n";
import { fetchAPI, apiHandler, apiAction } from "~/utils/api";
import * as fcm from "~/utils/fcm";

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    flex: 1,
    backgroundColor: Colors.transparent,
    justifyContent: "space-between",
    height: Screen.height,
    ...Platform.select({
      ios: {
        marginTop: Screen.scale(-20),
      },
    }),
    paddingLeft: Screen.scale(8),
    paddingBottom: Screen.scale(32),
    // paddingTop: Screen.scale(49)
  },
  item: {
    paddingBottom: Screen.scale(22),
    fontWeight: "600",
  },
  appInfoText: {
    color: Colors.warmGrey,
    fontSize: Screen.scale(12),
    lineHeight: parseInt(Screen.scale(20), 10),
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
