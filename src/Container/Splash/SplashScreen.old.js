import _ from "lodash";
import PropTypes from "prop-types";
import interval from "interval-promise";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";

import Config from "App/Config";
import { Colors, Images } from "App/Theme";
import { Screen } from "App/Helpers";

import { updateUser, cleanUser } from "App/Stores/User/Actions";
import Storage from "App/constant/storage";
import { getItem, setItem } from "../utils/asyncStorage";

import { getToken } from "../utils/fcm";
import { getRandomSeed, getRandomNickName } from "../utils/user";
// import { fetchAPI, apiHandler, apiAction } from '../utils/api';

import SplashView from "./SplashView";

class SplashScreen extends React.Component {
  // showSignUp = null;

  showHomePage = null;

  static propTypes = {
    // getNearCircles: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    cleanUser: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const storageFirstUse = await getItem(Storage.FIRST_USE);
    console.log("storageFirstUse=>", storageFirstUse);
    this.isFirstUse = _.isEqual(storageFirstUse, {});
    // const auth = await getItem(Storage.AUTHORIZATION);
    // const storageImportUser = await getItem(Storage.IMPORT_USER);
    // const isImportUser = !_.isEqual(storageImportUser, {});
    // const needLogin = Config.initPage === 'auth' || _.isEmpty(auth);
    // this.showSignUp = _.isEmpty(auth);

    // 預設進入 Home
    // this.showHomePage = !needLogin && !isImportUser;

    // Inject user data
    // const userData = await getItem(Storage.USER_DATA);
    // if (userData) {
    //   this.props.updateUser(userData);
    // }
    // console.log(this.showSignUp, this.showHomePage);
    // if (auth) {
    //   // get near circles
    //   if (!needLogin) {
    //     console.log('no need login');
    //     this.props.getNearCircles();
    //   }
    // }

    // redirect
    interval(
      async () => {
        await this.continue();
      },
      Config.SPLASH_REDIRECT_DELAY,
      { iterations: 3 }
    );
  }

  autoLoginWithRandomUserData = async () => {
    console.log("autoLoginWithRandomUserData");
    const token = await getToken();
    // console.log('token', token);
    const avatarId = getRandomSeed(12);
    const nickName = getRandomNickName();
    const data = {
      avatarKey: `Avatar${avatarId}`,
      nickname: nickName,
      identifier: `${new Date().getTime()}${Math.floor(
        Math.random() * 100 + 1
      )}`,
      deviceInfo: {
        deviceToken: token,
        platform: Platform.OS === "ios" ? "IOS_FCM" : "ANDROID",
      },
    };
    // console.log('data', data);
    const res = await fetchAPI(apiAction.SIGN_UP, data);
    await apiHandler({
      res,
      done: async (_res) => {
        await setItem(Storage.AUTHORIZATION, _res.data.Authorization);
        // await setItem(Storage.USER_DATA, _res.data);
        // 紀錄登入資訊
        await setItem(Storage.LOGIN_INFO, {
          avatarId,
          avatarSource: Images[`avatar${avatarId}`],
          name: nickName,
        });
        this.props.updateUser(_res.data);

        Actions.RootTabs({
          panHandlers: null,
          type: "replace",
        });
      },
      fail: (err) => {
        console.warn(err);
      },
    });
  };

  continue = async () => {
    if (this.isFirstUse) {
      // skip intro since new version changes
      // Actions.intro({ type: 'replace' });
      console.log("this.isFirstUse!");
      // await this.autoLoginWithRandomUserData();
      const { cleanUser } = this.props;
      cleanUser();
      Actions.signUp();
    } else {
      Actions.RootTabs({
        panHandlers: null,
        type: "replace",
      });
    }
  };

  render() {
    return <SplashView />;
  }
}

export default connect(
  (state) => ({
    circle: state.circle,
    user: state.user,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        updateUser,
        cleanUser,
      },
      dispatch
    )
)(SplashScreen);
