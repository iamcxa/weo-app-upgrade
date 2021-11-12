import { has, throttle } from "lodash";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import BackgroundGeolocation from "react-native-background-geolocation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Config from "~/Config";
import { Dialog, Fcm, Permission, t } from "~/Helper";
import { AppStateActions, CircleActions } from "~/Store/Actions";
import { AppPermissionSelectors } from "~/Store/Selectors";

const {
  // CHECK_CURRENT_CIRCLE_THROTTLE,
  LOCATION_THROTTLE,
  // STAY_CIRCLE_TIME,
  // NOTIFICATION_FOUND_NEW_CIRCLE,
  ON_GEOFENCE_THROTTLE,
  LOCATION_CONFIG,
} = Config;

let isHeadlessTaskRegistered = false;

class GeolocationMonitor extends React.Component {
  _handleGeofence = throttle((geofence) => {
    if (!geofence) {
      return;
    }
    console.group("- [event] geofence crossed");
    console.log("geofence listener", geofence);
    const { location, identifier, action } = geofence;
    const { extras = {} } = location.geofence;
    console.log("location: ", location);
    console.info(
      `User has been "${action}" to "${extras.name}"(id: ${identifier}).`
    );
    console.groupEnd();

    const {
      userCircle,
      currentCircle,
      hasCircleNotify,
      updateWhenExitCircle,
      updateWhenEnterCircle,
      fetchGetStayCircles,
    } = this.props;
    switch (action) {
      case "DWELL": {
        console.log("extras=>", extras);
        console.log("currentCircle=>", currentCircle);
        if (currentCircle && extras && currentCircle.id !== extras.id) {
          fetchGetStayCircles(null, "geofence-DWELL");

          updateWhenEnterCircle(extras);
        }
        // 如果 currentCircle 跟 dwell circle 不同，表示 user 可能直接空降到該 circle
        // if (
        //   hasCircleNotify &&
        //   has(extras, 'id') &&
        //   has(extras, 'name') &&
        //   (!userCircle || userCircle.id !== extras.id)
        // ) {
        //   Fcm.presentNotification({
        //     title: t('_notification_enter_circle_title', {
        //       circleName: extras.name,
        //     }),
        //     // body: `geofence-ENTER-${extras.name}`,
        //     data: { action: 'enter-circle' },
        //   });
        // }
        break;
      }
      case "ENTER": {
        console.log("extras.id=>", extras.id);
        console.log("userCircle.id=>", userCircle.id);
        if (
          hasCircleNotify &&
          has(extras, "id") &&
          has(extras, "name") &&
          (!userCircle || userCircle.id !== extras.id)
        ) {
          Fcm.presentNotification({
            title: t("_notification_enter_circle_title", {
              circleName: extras.name,
            }),
            // body: `geofence-ENTER-${extras.name}`,
            data: { action: "enter-circle" },
          });
        }
        updateWhenEnterCircle(extras);
        fetchGetStayCircles(null, "geofence-ENTER");
        break;
      }
      case "EXIT":
        if (hasCircleNotify && extras) {
          __DEV__ &&
            Fcm.presentNotification({
              title: "_handleGeofence",
              body: `geofence-EXIT-${extras.name}`,
              data: { action: "leave-circle" },
            });
        }
        updateWhenExitCircle(extras);
        fetchGetStayCircles(null, "geofence-EXIT");

        // if (currentCircle && extras && currentCircle.id !== extras.id) {
        //   Dialog.leaveCircleAlert({
        //     onYesPress: () => {
        //       AppStore.dispatch(CircleActions.updateLeftAppTime(null));
        //       AppStore.dispatch(CircleActions.updateLeftCircleTime(null));
        //       AppStore.dispatch(CircleActions.updateUserCircle(extras));
        //     },
        //     onNoPress: () => {},
        //     oldCircleName: userCircle.name,
        //     newCircleName: extras.name,
        //   });
        // }
        break;
      default:
        break;
    }
  }, ON_GEOFENCE_THROTTLE);

  constructor(props) {
    super(props);
    this.state = {
      APP_CONFIG: {
        reset: true, // <-- set true to ALWAYS apply supplied config; not just at first launch.
        enableHeadless: true,
        forceReloadOnLocationChange: true,
        forceReloadOnGeofence: true,

        // Geolocation Config
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_LOW,
        stationaryRadius: 100,
        geofenceProximityRadius: 10000,

        // Activity Recognition
        stopTimeout: 10,
        stopOnStationary: false,
        disableMotionActivityUpdates: true, // <-- https://transistorsoft.github.io/react-native-background-geolocation/interfaces/_react_native_background_geolocation_.config.html#disablemotionactivityupdates

        // Application config
        debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        startOnBoot: false, // <-- Auto start tracking when device is powered-up.
        stopOnTerminate: true, // <-- Set false to continue tracking after user terminates the app.
        autoSync: false,
        foregroundService: false,
        notification: {
          title: t("_notification_geolocation_detection_title"),
          text: t("_notification_geolocation_detection_body"),
          smallIcon: "drawable/ic_notification_default",
          // largeIcon: 'drawable/ic_notification_default',
          channelName: "WeO Circle tracker",
          priority: BackgroundGeolocation.NOTIFICATION_PRIORITY_MIN,
        },

        // Notification config
        locationAuthorizationRequest: "WhenInUse", // Always, WhenInUse or Any.
        locationAuthorizationAlert: {
          titleWhenOff: "",
          titleWhenNotEnabled: "",
          instructions: t("app_route_turn_on_location"),
          cancelButton: "Not Now",
          settingsButton: "OK",
        },
        ...LOCATION_CONFIG,
      },
    };
  }

  componentDidMount() {
    const { hasLowGeolocationPermission, hasHighGeolocationPermission } =
      this.props;
    if (hasLowGeolocationPermission || hasHighGeolocationPermission) {
      // 綁定 geolocation handler
      this.setupLocationHandler();
    } else {
      Permission.requestGeolocationPermission();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      currentState,
      currentGeolocation,
      updateLeftAppTime,
      hasLowGeolocationPermission,
      hasHighGeolocationPermission,
    } = this.props;

    // setup location listeners when got permissions
    if (
      hasLowGeolocationPermission !== prevProps.hasLowGeolocationPermission &&
      hasLowGeolocationPermission === true
    ) {
      this.setupLocationHandler();
    } else if (
      hasHighGeolocationPermission !== prevProps.hasHighGeolocationPermission &&
      hasHighGeolocationPermission === true
    ) {
      this.setupLocationHandler();
    }

    // update left app time when the app enter background
    if (prevProps.currentState !== currentState) {
      if (currentState === "background") {
        updateLeftAppTime(moment().unix());
      }
    }

    // shows alert when geolocation provider is disabled
    if (currentGeolocation !== prevProps.currentGeolocation) {
      const { provider } = currentGeolocation;
      if (!provider.enabled) {
        // location service enabled
        Dialog.requireEnableLocationServiceAlert(
          t("app_route_turn_on_location")
        );
      }
    }
  }

  // You must remove listeners when your component unmounts
  componentWillUnmount() {
    BackgroundGeolocation.removeListeners(() => {
      BackgroundGeolocation.stop();
    });
  }

  onLocation = throttle((location) => {
    console.group("- [event] location");
    // TODO: "motionchange"?
    this.props.fetchGetStayCircles();
    console.log("location: ", location);
    console.groupEnd();
    // update to store
    // this.props.setUserCircle();
    // if (location.is_moving) {
    //   const { userCircle, currentCircle } = this.props.circle;
    //   if (!userCircle || !currentCircle) {
    //   }
    // }
  }, LOCATION_THROTTLE);

  onError = (error) => {
    console.group("- [event] location error");
    console.warn("error: ", error);

    const { hasLowGeolocationPermission, hasHighGeolocationPermission } =
      this.props;
    if (hasLowGeolocationPermission || hasHighGeolocationPermission) {
      // 綁定 geolocation handler
      this.setupLocationHandler();
    } else {
      Permission.requestGeolocationPermission();
    }
    console.groupEnd();
  };

  onActivityChange = (activity) => {
    // console.group('- [event] activityChange');
    // console.log('activity: ', activity); // eg: 'on_foot', 'still', 'in_vehicle'
    // console.groupEnd();
  };

  handleProviderChange = (provider) => {
    console.group("- [event] providerChange");
    console.log("provider: ", provider);
    console.log("  enabled: ", provider.enabled);
    console.log("  gps: ", provider.gps);
    console.log("  network: ", provider.network);
    console.log("  status: ", provider.status);
    console.groupEnd();

    const { onGeolocationChange } = this.props;
    onGeolocationChange({ provider });
  };

  onMotionChange = (location) => {
    console.group("- [event] motionChange");
    console.log("isMoving: ", location.isMoving, location);
    console.groupEnd();

    const { onGeolocationChange } = this.props;
    onGeolocationChange({ motion: location });
  };

  handleEnableChange = (event) => {
    console.group("- [event] enableChange");
    console.log("- enabledchange, plugin is enabled? ", event.enabled);
    console.groupEnd();
    if (event.enabled) {
      // 如果 geolocation 啟動成功，就發 request 去更新 circles
      // this.props.getNearCircles();
      // BackgroundGeolocation.changePace(true);
    }
  };

  setupLocationHandler = async () => {
    // clean geofences
    if (BackgroundGeolocation) {
      const cleanFences = () =>
        new Promise((res) => {
          BackgroundGeolocation.removeGeofences(() => {
            console.log("--- clean all geofences when start up ---");
            // this.props.fetchGetStayCircles(null, 'cleanFences');
            return res();
          });
        });
      await cleanFences();
    }

    // 1.  Wire up event-listeners
    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.on("location", this.onLocation, this.onError);

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    // BackgroundGeolocation.on('motionchange', this.onMotionChange);

    // This event fires when a change in motion activity is detected
    // BackgroundGeolocation.on('activitychange', this.onActivityChange);

    // This event fires when the user toggles location-services authorization
    setTimeout(() => {
      BackgroundGeolocation.on("providerchange", this.handleProviderChange);
    }, 10000);

    // to monitor whether BackgroundGeolocation is enabled or not.
    // BackgroundGeolocation.on('enabledchange', this.handleEnableChange);

    BackgroundGeolocation.on("geofence", this._handleGeofence);

    const { hasLowGeolocationPermission, hasHighGeolocationPermission } =
      this.props;
    /// /
    // 2.  Execute #ready method (required)
    //
    BackgroundGeolocation.ready(
      Object.assign(this.state.APP_CONFIG, {}),
      (state) => {
        console.log(
          "- BackgroundGeolocation is configured and ready: ",
          state.enabled
        );

        if (!state.enabled) {
          BackgroundGeolocation.startGeofences((state) => {
            console.log(
              "- Geofence-only monitoring started",
              state.trackingMode
            );
          });
        }
        /// /
        // 3. Start tracking!
        //
        BackgroundGeolocation.start((startState) => {
          console.log("- Monitoring started state", startState);
          // BackgroundGeolocation.changePace(true);
        });

        /// /
        // Register your HeadlessTask with BackgroundGeolocation plugin.
        //
        if (this.state.APP_CONFIG.enableHeadless) {
          BackgroundGeolocation.registerHeadlessTask(this.headlessTask);
        }
      }
    );
  };

  headlessTask = async (event) => {
    if (!isHeadlessTaskRegistered) {
      isHeadlessTaskRegistered = true;
    } else {
      return false;
    }
    const { params } = event;
    console.log("[BackgroundGeolocation HeadlessTask] -", event.name, params);
    switch (event.name) {
      // case 'terminate':
      //   this.props.fetchGetStayCircles();
      //   break;
      case "location":
        this.onLocation();
        break;
      case "geofence":
        this._handleGeofence();
        break;
      case "heartbeat":
        // Use await for async tasks
        // const location = await getCurrentPosition();
        // console.log('[BackgroundGeolocation HeadlessTask] - getCurrentPosition:', location);
        break;
      default:
        break;
    }
  };

  render() {
    return null;
  }
}

GeolocationMonitor.propTypes = {
  hasLowGeolocationPermission: PropTypes.bool,
  hasHighGeolocationPermission: PropTypes.bool,
  fetchGetStayCircles: PropTypes.func.isRequired,
  onGeolocationChange: PropTypes.func.isRequired,
  updateLeftAppTime: PropTypes.func.isRequired,
  updateWhenEnterCircle: PropTypes.func.isRequired,
  updateWhenExitCircle: PropTypes.func.isRequired,
  currentState: PropTypes.string,
  currentGeolocation: PropTypes.object,
  hasCircleNotify: PropTypes.bool.isRequired,
  userCircle: PropTypes.object,
  currentCircle: PropTypes.object,
  children: PropTypes.any,
};

GeolocationMonitor.defaultProps = {
  children: null,
  currentState: "",
  userCircle: null,
  currentCircle: null,
  currentGeolocation: null,
  hasLowGeolocationPermission: false,
  hasHighGeolocationPermission: false,
};

export default connect(
  (state) => ({
    userCircle: state.circle.userCircle,
    currentCircle: state.circle.currentCircle,
    currentState: state.appState.currentState,
    currentGeolocation: state.appState.currentGeolocation,
    hasCircleNotify: state.user.config.hasCircleNotify,
    hasLowGeolocationPermission: AppPermissionSelectors.hasThisPermission(
      Permission.GEOLOCATION_LOW
    )(state),
    hasHighGeolocationPermission: AppPermissionSelectors.hasThisPermission(
      Permission.GEOLOCATION_High
    )(state),
  }),
  (dispatch) =>
    bindActionCreators(
      {
        updateLeftAppTime: CircleActions.updateLeftAppTime,
        setUserCircle: CircleActions.setUserCircle,
        updateCircles: CircleActions.updateCircles,
        getNearCircles: CircleActions.getNearCircles,
        updateWhenEnterCircle: CircleActions.updateWhenEnterCircle,
        updateWhenExitCircle: CircleActions.updateWhenExitCircle,
        fetchGetStayCircles: CircleActions.fetchGetStayCircles,
        onGeolocationChange: AppStateActions.onGeolocationChange,
      },
      dispatch
    )
)(GeolocationMonitor);
