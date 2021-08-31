import React from 'react';
import PropTypes from 'prop-types';
// import ClusteredMapView from 'react-native-maps-super-cluster';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { throttle, isEqual } from 'lodash';
import { Marker } from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
import { Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

import { MainNavBar, AndroidBackKey } from '~/Components';
import { Screen, Geolocation, Permission } from '~/Helper';
import { translate as t } from '~/Helpers/I18n';
import { Colors, Images, Classes } from '~/Theme';
import { AppStateActions, CircleActions, AppPermissionSelectors } from '~/Stores';

import { Config } from '~/Config';
import styles from './PeekMapScreenStyle';
// import CircleMarker from './CircleMarker';

const PROVIDER_GOOGLE = 'google';
const GET_CIRCLE_RADIUS = 5000 * 1000 * 1000;
const MIN_ZOOM_LEVEL = 5;
const ASPECT_RATIO = Screen.width / Screen.height;
const LATITUDE_DELTA = 0.082;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const INITIAL_REGION = {
//   latitude: 22.416659,
//   longitude: 114.210921,
//   latitudeDelta: LATITUDE_DELTA,
//   longitudeDelta: LONGITUDE_DELTA,
// };

const CAMERA_OPTIONS = {
  pitch: 1,
  heading: 1,
  altitude: 10000,
  zoom: 17,
};

// const INITIAL_CAMERA = {
// ...CAMERA_OPTIONS,
// center: {
//   latitude: 22.416659,
//   longitude: 114.210921,
// },
// };

let CircleMarker = null;
let ClusteredMapView = null;
let isComponentMounted = false;

class PeekMapScreen extends React.Component {
  static propTypes = {
    hasGeolocationPermission: PropTypes.bool.isRequired,
    fetchGetStayCircles: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    updateLoading: PropTypes.func.isRequired,
    routeName: PropTypes.string.isRequired,
    sceneKey: PropTypes.string.isRequired,
    prevRoute: PropTypes.string.isRequired,
    nearCircles: PropTypes.array,
    activeMarker: PropTypes.object,
    userCircle: PropTypes.object,
    currentCircle: PropTypes.object,
  };

  static defaultProps = {
    nearCircles: [],
    activeMarker: null,
    userCircle: null,
    currentCircle: null,
  };

  state = {
    activeId: null,
    isMoveToCenter: false,
    isDragging: false,
    isSelectNewActiveId: false,
    isMapLoaded: false,
    INITIAL_REGION: {
      latitude: 22.416659,
      longitude: 114.210921,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    initialCamera: {
      ...CAMERA_OPTIONS,
      center: {
        latitude: 22.416659,
        longitude: 114.210921,
      },
    },
  };

  markerRefs = [];

  circleRefs = [];

  loadingTimer = null;

  async componentDidMount() {
    __DEV__ && console.log('@Enter PeekMapScreen');

    setTimeout(() => {
      this.showMyLocation();
    }, 1000);

    const { hasGeolocationPermission } = this.props;
    if (hasGeolocationPermission) {
      const { isMapLoaded } = this.state;
      if (!isMapLoaded) {
        const { latitude, longitude } = await Geolocation.getCurrentPosition();
        this.setState((state) => ({
          INITIAL_REGION: {
            ...state.INITIAL_REGION,
            latitude,
            longitude,
          },
          initialCamera: {
            ...CAMERA_OPTIONS,
            center: {
              latitude,
              longitude,
            },
          },
        }));
      }
    }

    isComponentMounted = true;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { sceneKey, activeMarker } = this.props;
    const { activeId } = this.state;
    if (sceneKey.includes(nextProps.routeName)) {
      isComponentMounted = true;
    } else {
      isComponentMounted = false;
    }
    if (
      !isComponentMounted ||
      !nextState.isMapLoaded ||
      nextState.isWaitingForLoadPeekTopList ||
      !sceneKey.includes(nextProps.routeName)
    ) {
      return false;
    }
    if (nextProps.activeMarker && nextProps.activeMarker !== activeMarker) {
      return true;
    }
    // 如果是 activeId 改變，則不要抓新資料
    if (nextState.activeId && activeId !== nextState.activeId) {
      this.setState({
        isSelectNewActiveId: true,
      });
      return true;
    }
    if (nextProps.activeMarker && nextProps.activeMarker !== activeMarker) {
      return true;
    }
    return !isEqual(this.state, nextState) || !isEqual(this.props, nextProps);
  }

  componentDidUpdate(prevProps, prevState) {
    const { sceneKey, activeMarker, userCircle } = this.props;
    // auto set center of user current location when enter screen/
    if (sceneKey === Actions.currentScene) {
      if (userCircle !== prevProps.userCircle) {
        this.showMyLocation();
      }
    }
    if (activeMarker && prevProps.activeMarker !== activeMarker) {
      this.moveCameraToCircle(activeMarker);
    }
  }

  moveCameraToCircle = ({ latitude, longitude, id } = this.props.activeMarker) => {
    console.log('move to circle');

    this.setState(
      {
        isDragging: true,
      },
      () => {
        if (this.map) {
          this.map.mapview.animateCamera(
            {
              center: {
                latitude,
                longitude,
              },
              ...CAMERA_OPTIONS,
              zoom: 18,
            },
            500,
          );
        }
        setTimeout(() => {
          if (this.markerRefs[id]) {
            this.markerRefs[id].showCallout();
          }
        }, 700);
        setTimeout(() => {
          this.setState({
            isDragging: false,
            isMoveToCenter: true,
          });
        }, 3000);
      },
    );
    console.log('move to circle ok');
  };

  componentWillUnmount() {
    isComponentMounted = false;
  }

  getMapData = () => {
    const { nearCircles } = this.props;
    return nearCircles
      .filter((e) => !e.isHidden)
      .map((item) => ({
        ...item,
        location: {
          latitude: item.latitude,
          longitude: item.longitude,
        },
      }));
  };

  showMyLocation = () => {
    const { hasGeolocationPermission } = this.props;
    if (hasGeolocationPermission) {
      setTimeout(
        async () => {
          const { latitude, longitude } = await Geolocation.getCurrentPosition();
          if (this.map) {
            this.map.mapview.animateCamera(
              {
                center: {
                  latitude,
                  longitude,
                },
                ...CAMERA_OPTIONS,
              },
              500,
            );
            this.setState(
              () => ({
                // isMapLoaded: true,
                isMoveToCenter: true,
              }),
              // () => this.handleGetNearCircles(),
            );
          }
        },
        this.state.isMapLoaded ? 1000 : 5000,
      );
    }
    if (CircleMarker === null) {
      CircleMarker = require('./CircleMarker').default;
    }
    if (ClusteredMapView === null) {
      ClusteredMapView = require('react-native-maps-super-cluster').default;
    }
    this.setState({ isMapLoaded: true });
  };

  handleGetNearCircles = throttle((cb) => {
    const { fetchGetStayCircles, sceneKey } = this.props;
    fetchGetStayCircles(cb, sceneKey);
  }, 30 * 1000);

  renderCluster = (cluster, onPress) => {
    const { pointCount, coordinate, clusterId } = cluster;

    // use pointCount to calculate cluster size scaling
    // and apply it to "style" prop below

    // eventually get clustered points by using
    // underlying SuperCluster instance
    // Methods ref: https://github.com/mapbox/supercluster
    // const clusteringEngine = this.map.getClusteringEngine();
    // const clusteredPoints = clusteringEngine.getLeaves(clusterId, 100);

    const { isDragging } = this.state;
    return (
      <Marker
        tracksViewChanges={false}
        // tracksViewChanges={isDragging}
        identifier={`cluster-${clusterId}`}
        coordinate={coordinate}
        onPress={onPress}
      >
        <View style={styles.clusterContainer}>
          <Text style={styles.clusterText}>{pointCount}</Text>
        </View>
        {/*
            Eventually use <Callout /> to
            show clustered point thumbs, i.e.:
            <Callout>
              <ScrollView>
                {
                  clusteredPoints.map(p => (
                    <Image source={p.image}>
                  ))
                }
              </ScrollView>
            </Callout>
            IMPORTANT: be aware that Marker's onPress event isn't really consistent when using Callout.
           */}
      </Marker>
    );
  };

  handleCalloutPress = (circleData) =>
    throttle(() => {
      const { nearCircles } = this.props;
      const { id } = circleData;
      const otherCircles = nearCircles.filter((circle) => circle.id !== id);
      const circleList = [circleData, ...otherCircles.sort((a, b) => b.topicCount - a.topicCount)];
      // console.log('circleList', circleList);
      this.setState(
        () => ({
          isWaitingForLoadPeekTopList: true,
        }),
        () => {
          Actions.peek_topicList({ circleList });
          setTimeout(() => {
            this.setState({
              isWaitingForLoadPeekTopList: false,
            });
          }, 2000);
        },
      );
    }, 3000);

  renderMarker = (circleData) => {
    const { id, name, longitude, latitude, radius = 200 } = circleData;
    const { activeId, isDragging } = this.state;
    return (
      <CircleMarker
        // tracksViewChanges={false}
        tracksViewChanges={isDragging}
        key={id}
        identifier={`pin-${id}`}
        callbackRef={(r) => {
          this.markerRefs[id] = r;
        }}
        circleCallbackRef={(r) => {
          this.circleRefs[id] = r;
        }}
        name={name}
        location={{ longitude, latitude: latitude - 0.001 }}
        radius={radius}
        active={id === activeId}
        onPress={() => {
          const camera = {
            center: {
              latitude,
              longitude,
            },
          };
          this.setState(
            {
              activeId: id,
              isSelectNewActiveId: true,
            },
            () => {
              this.setCircleColor();
              if (this.map) {
                this.map.mapview.animateCamera(camera, { duration: 500 });
              }
            },
          );
        }}
        onCalloutPress={this.handleCalloutPress(circleData)}
      />
    );
  };

  onMapReady = () => {
    this.setCircleColor();
  };

  onRegionChange = throttle(() => {
    this.setState({
      isMoveToCenter: false,
      isDragging: true,
    });
  }, 300);

  onRegionChangeComplete = (region) => {
    this.setState(
      {
        isDragging: true,
      },
      () => {
        setTimeout(() => {
          this.setState(
            {
              isDragging: false,
              isSelectNewActiveId: false,
            },
            () => {
              this.setCircleColor();
            },
          );
        }, 200);
      },
    );
  };

  setCircleColor = () => {
    setTimeout(() => {
      this.circleRefs.map((circleRef) => {
        circleRef &&
          circleRef.setNativeProps({
            fillColor: Colors.mapCircle,
            strokeColor: Colors.mapCircleBorder,
          });
      });
      this.state.activeId &&
        this.circleRefs[this.state.activeId] &&
        this.circleRefs[this.state.activeId].setNativeProps({
          fillColor: Colors.activeMapCircle,
          strokeColor: Colors.activeMapCircleBorder,
        });
    }, 50);
  };

  getMapViewRef = (r) => {
    this.map = r;
  };

  renderTitleComponent = () => {
    const { isLoading } = this.props;
    return (
      <View style={Classes.fillCenter}>
        <View style={styles.navTitleContainer}>
          <MaterialIcons name="eye-outline" size={23} color={Colors.black} />
          <Text style={styles.titleText}>{t('peek_map_title_peek_only')}</Text>
          <View style={styles.titleLoading}>
            <ActivityIndicator animating={isLoading} />
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { sceneKey, hasGeolocationPermission } = this.props;
    const { isMapLoaded, isWaitingForLoadPeekTopList, INITIAL_CAMERA, INITIAL_REGION } = this.state;
    return (
      <View style={styles.container}>
        <AndroidBackKey sceneKey={sceneKey} backTo={Actions.hereYouAre} />
        <MainNavBar
          leftOnPress={() => {
            Actions.hereYouAre({
              hideTabBar: false,
              statusBarColor: Colors.paleGrey,
            });
          }}
          titleComponent={this.renderTitleComponent()}
          style={styles.navBar}
        />
        {isMapLoaded ? (
          <ClusteredMapView
            // customMapStyle={customMapStyle}
            showsUserLocation
            maxZoom={20}
            extent={384}
            nodeSize={192}
            style={styles.map}
            ref={this.getMapViewRef}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            minZoomLevel={MIN_ZOOM_LEVEL}
            data={this.getMapData()}
            initialRegion={INITIAL_REGION}
            initialCamera={INITIAL_CAMERA}
            renderMarker={this.renderMarker}
            renderCluster={this.renderCluster}
            edgePadding={{ top: 100, left: 100, bottom: 100, right: 100 }}
            onMapReady={this.onMapReady}
            onClusterPress={this.setCircleColor}
            onRegionChange={this.onRegionChange}
            onRegionChangeComplete={this.onRegionChangeComplete}
          />
        ) : (
          <View style={Classes.fillCenter}>
            <ActivityIndicator size="large" animating />
          </View>
        )}

        <TouchableOpacity
          style={styles.userLocationButton}
          onPress={
            hasGeolocationPermission ? this.showMyLocation : Permission.requestGeolocationPermission
          }
        >
          <Image source={Images.userLocation} style={styles.userLocationIcon} />
        </TouchableOpacity>

        {isWaitingForLoadPeekTopList && (
          <View
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              top: 0,
              zIndex: 1000,
              backgroundColor: Colors.paleGrey50,
            }}
          >
            <View style={Classes.fillCenter}>
              <ActivityIndicator loading />
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default connect(
  (state, props) => ({
    sceneKey: props.name,
    userCircle: state.circle.userCircle,
    currentCircle: state.circle.currentCircle,
    nearCircles: state.circle.nearCircles,
    routeName: state.appRoute.routeName,
    prevRoute: state.appRoute.prevRoute,
    isLoading: state.appState.isLoading,
    hasGeolocationPermission:
      AppPermissionSelectors.hasThisPermission(Permission.GEOLOCATION_LOW)(state) ||
      AppPermissionSelectors.hasThisPermission(Permission.GEOLOCATION_HIGH)(state),
  }),
  (dispatch) =>
    bindActionCreators(
      {
        onRootTabIndexChange: AppStateActions.onRootTabIndexChange,
        updateLoading: AppStateActions.onLoading,
        fetchGetStayCircles: CircleActions.fetchGetStayCircles,
      },
      dispatch,
    ),
)(PeekMapScreen);
