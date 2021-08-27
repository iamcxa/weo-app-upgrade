import React from 'react';
import { View, Text, Image } from 'react-native';
import { Marker, Circle, Callout } from 'react-native-maps';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

import { Colors, Images } from '~/Theme';

import styles from './CircleMarkerStyle.js';

const CircleMarker = (props) => (
  <View {...props}>
    <Circle
      ref={props.circleCallbackRef}
      center={props.location}
      radius={props.radius || 200}
      fillColor={props.active ? Colors.activeMapCircle : Colors.mapCircle}
      strokeColor={props.active ? Colors.activeMapCircleBorder : Colors.mapCircleBorder}
      lineDashPattern={props.active ? [1] : [3]}
      zIndex={props.active ? 10 : 1}
    />
    <Marker
      tracksViewChanges={props.tracksViewChanges}
      coordinate={props.location}
      onPress={props.onPress}
      ref={props.callbackRef}
      style={styles.marker}
    >
      <Image source={Images.markerPin} style={styles.markerImage} resizeMode="contain" />
      <Text style={[styles.title, styles.titleSmall]}>{props.name}</Text>
      <Callout onPress={props.onCalloutPress} style={styles.callout}>
        <Text style={styles.title}>{props.name}</Text>
        <Icon name="ios-arrow-forward" size={20} color={Colors.mainYellow} style={styles.icon} />
      </Callout>
    </Marker>
  </View>
);

CircleMarker.propTypes = {
  tracksViewChanges: PropTypes.bool,
  identifier: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  radius: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  active: PropTypes.bool,
  onPress: PropTypes.func,
  onCalloutPress: PropTypes.func,
  callbackRef: PropTypes.func,
  circleCallbackRef: PropTypes.func,
};

CircleMarker.defaultProps = {
  tracksViewChanges: false,
  onPress: () => {},
  onCalloutPress: () => {},
  active: false,
  callbackRef: () => {},
};

export default CircleMarker;
