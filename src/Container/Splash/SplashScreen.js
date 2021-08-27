import React from 'react';
import PropTypes from 'prop-types';
import { isString } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CircleActions, UserActions } from '~/Stores';

import SplashView from './SplashView';

class SplashScreen extends React.Component {
  static propTypes = {
    updateUserStore: PropTypes.func.isRequired,
    fetchPostSignUp: PropTypes.func.isRequired,
    fetchGetStayCircles: PropTypes.func.isRequired,
    cleanUser: PropTypes.func.isRequired,
    apiToken: PropTypes.string,
    fcmToken: PropTypes.string,
    currentState: PropTypes.string,
    sceneKey: PropTypes.string.isRequired,
    // hasGeolocationPermission: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    apiToken: '',
    currentState: '',
  };

  timer = null;

  async componentDidMount() {
    // await this.checkLocationPermission();
    const { apiToken, fcmToken } = this.props;

    if (!apiToken && !fcmToken) {
    }
  }

  // shouldComponentUpdate(nextProps) {}

  // async componentDidUpdate(prevProps, prevState) {
  //   const { currentState } = this.props;
  //   if (currentState !== prevProps.currentState && currentState === 'active') {
  //     await this.checkLocationPermission();
  //   }
  // }

  // checkLocationPermission = async () => {
  //   let havePermission = await Permission.checkAndRequestPermission(
  //     Permission.location,
  //     false,
  //   );
  //   if (!havePermission) {
  //     havePermission = await Permission.checkAndRequestPermission(
  //       Permission.location,
  //       true,
  //     );
  //   }
  //   console.log('havePermission=>', havePermission);
  //   if (havePermission === true) {
  //     const { fetchGetStayCircles, sceneKey } = this.props;
  //     fetchGetStayCircles(nsrc/Locale/index.jsull, sceneKey);
  //     if (this.timer) {
  //       clearTimeout(this.timer);
  //     }
  //     this.timer = setTimeout(this.jumpToNextScreen, Config.SPLASH_REDIRECT_DELAY);
  //   } else {
  //     requestAnimationFrame(Dialog.requestLocationPermissionFromSystemAlert);
  //   }
  // };

  jumpToNextScreen = () => {
    const { apiToken, cleanUser } = this.props;
    if (!apiToken || !isString(apiToken)) {
      // skip intro since new version changes
      // Actions.intro({ type: 'replace' });
      // await this.autoLoginWithRandomUserData();
      cleanUser();
      // requestAnimationFrame(Actions.SignUpScreen);
      this.autoLoginWithRandomUserData();
    } else {
      // requestAnimationFrame(Actions.HomeScreen);
    }
  };

  // autoLoginWithRandomUserData = () => {
  //   console.log('autoLoginWithRandomUserData');
  //   // console.log('data', data);
  //   const { fetchPostSignUp, fcmToken } = this.props;

  //   const handleSignup = (token = false) => {
  //     console.log('handleSignup token=>', token);
  //     const avatarId = User.getRandomSeed(12);
  //     const nickName = User.getRandomNickName();
  //     const data = {
  //       avatarKey: `Avatar${avatarId}`,
  //       nickname: nickName,
  //       identifier: `${new Date().getTime()}${Math.floor(Math.random() * 100 + 1)}`,
  //       deviceInfo: {
  //         deviceToken: token || this.props.fcmToken,
  //       },
  //     };
  //     fetchPostSignUp(data);
  //   };
  //   if (!fcmToken) {
  //     Dialog.requestFcmPermissionAlert({
  //       onSuccess: handleSignup,
  //       onFailure: handleSignup,
  //       onCancel: handleSignup,
  //     });
  //   } else {
  //     handleSignup();
  //   }
  // };

  render() {
    return <SplashView />;
  }
}

export default connect(
  (state, props) => ({
    sceneKey: props.name,
    apiToken: state.user.apiToken,
    fcmToken: state.user.fcmToken,
    currentState: state.appState.currentState,
    // hasGeolocationPermission: AppPermissionSelectors.hasThisPermission(
    // Permission.GEOLOCATION_LOW,
    // )(state),
  }),
  (dispatch) =>
    bindActionCreators(
      {
        fetchGetStayCircles: CircleActions.fetchGetStayCircles,
        updateUserStore: UserActions.updateUserStore,
        fetchPostSignUp: UserActions.fetchPostSignUp,
        cleanUser: UserActions.cleanUser,
        fetchPostAutoSignUp: UserActions.fetchPostAutoSignUp,
      },
      dispatch,
    ),
)(SplashScreen);
