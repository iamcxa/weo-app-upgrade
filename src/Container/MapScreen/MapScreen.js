import { get, lowerFirst } from "lodash";
import React from "react";
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  // Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Chip, FAB, Text, Tooltip } from "react-native-elements";
import MapView, {
  Callout,
  CalloutSubview,
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  ProviderPropType,
} from "react-native-maps";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AvatarBlock, TooltipPanel } from "~/Component";
import { Geolocation, Screen, t } from "~/Helper";
import { CircleActions, UserActions } from "~/Store/Actions";
import { Classes, Colors, Fonts, Images, Metrics } from "~/Theme";

import MapButtonLayer from "./Components/MapButtonLayer";

const { width, height } = Dimensions.get("window");

// 22.333103, 114.189517
const ASPECT_RATIO = width / height;
const LATITUDE = 24.1479661;
const LONGITUDE = 120.6713169;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const id = 0;

class MapScreen extends React.Component {
  mapView = null;

  tpMapCreation = null;

  tpMapRanking = null;

  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      camera: {
        pitch: 1,
        heading: 1,
        altitude: 10000,
        zoom: 15,
        center: {
          latitude: LATITUDE,
          longitude: LONGITUDE,
        },
      },
      markers: props.nearCircles
        .concat(props.insideCircles.map((e) => ({ ...e, isInside: true })))
        .concat([{ ...props.currentCircle, isCurrent: true }]),
    };
  }

  componentDidMount() {
    const { fetchGetStayCircles, updateUserStore, sceneKey } = this.props;

    console.log("sceneKey=>", sceneKey);
    fetchGetStayCircles();

    updateUserStore({
      tooltip: {
        MapScreen: {
          mapRankingVisible: true,
          mapCreationVisible: true,
        },
      },
    });

    console.log("this.state.markers=>", this.state.markers);

    // if (this.tpMapCreation) {
    //   this.tpMapCreation.toggleTooltip();
    // }
  }

  onRegionChangeComplete = (region, { isGesture }) => {
    // this.setState({ region });

    console.log("onRegionChangeComplete=>", region);
  };

  onMapPress(e) {
    console.log("onMapPress=>", e);
    console.log("onMapPress=>", e.currentTarget);
    console.log("onMapPress=>", e.target);
    console.log("onMapPress=>", e.nativeEvent);
    console.log("markers=>", this.state.markers);

    if (e.nativeEvent && e.nativeEvent.action === "marker-press") {
      const markerId = e.nativeEvent.id;
      this.setState((state) => ({
        ...state,
        markers: [
          ...this.state.markers.map((marker) =>
            `${marker.id}` === `${markerId}`
              ? {
                  ...marker,
                  active: true,
                }
              : {
                  ...marker,
                  active: false,
                }
          ),
        ],
      }));
    } else {
      // this.setState({
      //   markers: [
      //     ...this.state.markers,
      //     {
      //       active: false,
      //       coordinate: e.nativeEvent.coordinate,
      //       key: `${id++}`,
      //       color: randomColor(),
      //     },
      //   ],
      // });
    }
  }

  moveToUserLocation = async () => {
    const location = await Geolocation.getCurrentPosition();

    console.log("location=>", location);

    this.mapView.animateCamera({
      center: {
        longitude: location.longitude,
        latitude: location.latitude,
      },
      // accuracy: 5
      // speed: -1
      heading: location.heading,
      altitude: location.altitude,
      zoom: 15,
      pitch: 1,
    });
  };

  getTooltipReferences = (key) => (ref) => {
    this[key] = ref;
  };

  render() {
    const { sceneKey, navigation, tooltip, updateTooltipVisibility } =
      this.props;
    const getMarker = (marker, active) => {
      let MapMarker = Images.SvgMapPinGray;
      if (marker.isCurrent) {
        return (
          <View>
            <AvatarBlock avatar={Images.avatar1} name="user" />
            {marker.isMyCircle && (
              <Images.SvgMapMyCircle
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: -8,
                }}
              />
            )}
            {marker.isSubscribed && (
              <Images.SvgMapFav
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: -8,
                }}
              />
            )}
          </View>
        );
      } else if (marker.isMyCircle) {
        MapMarker = Images.SvgMapMyCircle;
      } else if (marker.isSubscribed) {
        MapMarker = Images.SvgMapFav;
      } else if (marker.isInside) {
        MapMarker = Images.SvgMapPinYellow;
      }
      return <MapMarker />;
    };

    const getCircleConfig = (marker) => {
      let color = {
        strokeColor: Colors.MAP_NEAR_CIRCLE_BORDER,
        fillColor: Colors.MAP_NEAR_CIRCLE,
        zIndex: 0,
      };
      if (marker.isCurrent) {
        color = {
          strokeColor: Colors.PRIMARY_YELLOW,
          fillColor: Colors.MAP_CURRENT_CIRCLE,
          zIndex: 500,
        };
      } else if (marker.isSubscribed) {
        color = {
          strokeColor: Colors.MAP_FAV_CIRCLE_BORDER,
          fillColor: Colors.MAP_FAV_CIRCLE,
          zIndex: 300,
        };
      } else if (marker.isMyCircle) {
        color = {
          strokeColor: Colors.MAP_MY_CIRCLE_BORDER,
          fillColor: Colors.MAP_MY_CIRCLE,
          zIndex: 400,
        };
      }
      return color;
    };
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => (this.mapView = ref)}
          provider={this.props.provider}
          // region={this.state.region}
          onRegionChangeComplete={this.onRegionChangeComplete}
          style={styles.map}
          initialCamera={this.state.camera}
          onPress={(e) => this.onMapPress(e)}
        >
          {this.state.markers
            .filter((e) => !e.isHidden)
            .map((marker) => (
              <>
                <Marker
                  onCalloutPress={() => Alert.alert("onCalloutPress")}
                  key={`marker-${marker.id}`}
                  identifier={`${marker.id}`}
                  coordinate={{
                    latitude: marker.latitude || 0,
                    longitude: marker.longitude || 0,
                  }}
                >
                  {getMarker(marker)}
                  <Text key={`text-${marker.id}`}>{marker.name}</Text>
                  <Callout key={`callout-${marker.id}`}>
                    {/* <Text>{marker.name}</Text> */}
                    <Text>{get(marker, "lastTopic.title", marker.name)}</Text>
                  </Callout>
                </Marker>

                <Circle
                  key={`circle-${marker.id}`}
                  strokeColor={
                    // marker.active ? Colors.activeMapCircleBorder : Colors.mapCircleBorder
                    getCircleConfig(marker).strokeColor
                  }
                  fillColor={getCircleConfig(marker).fillColor}
                  center={{
                    latitude: marker.latitude || 0,
                    longitude: marker.longitude || 0,
                  }}
                  radius={marker.radius || 0}
                  zIndex={getCircleConfig(marker).zIndex}
                />
              </>
            ))}
        </MapView>
        {/* <View style={styles.buttonContainer}> */}
        {/*  <TouchableOpacity onPress={() => this.setState({ markers: [] })} style={styles.bubble}> */}
        {/*    <Text>Tap map to create a marker of random color</Text> */}
        {/*  </TouchableOpacity> */}
        {/* </View> */}

        <MapButtonLayer
          tooltip={tooltip}
          sceneKey={sceneKey}
          navigation={navigation}
          moveToUserLocation={this.moveToUserLocation}
          updateTooltipVisibility={updateTooltipVisibility}
        />
      </View>
    );
  }
}

MapScreen.propTypes = {
  provider: ProviderPropType,
};

MapScreen.defaultProps = {
  provider: Platform.OS !== "ios" ? PROVIDER_GOOGLE : null,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default connect(
  (state, params) => ({
    sceneKey: params.route.name,
    navigation: params.navigation,
    tooltip: state.user.tooltip[params.route.name],
    currentCircle: state.circle.currentCircle,
    insideCircles: state.circle.insideCircles,
    nearCircles: state.circle.nearCircles,
    favCircles: state.circle.favCircles,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        updateTooltipVisibility: UserActions.updateTooltipVisibility,
        updateUserStore: UserActions.updateUserStore,
        fetchGetStayCircles: CircleActions.fetchGetStayCircles,
      },
      dispatch
    )
)(MapScreen);
