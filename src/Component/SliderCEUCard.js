import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
// import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import Screen from '../utils/screen';
import Colors from 'App/Theme/Colors';
import { Title } from '../widget/Label';

const { width: viewportWidth, height: viewportHeight } = Screen;

function wp(percentage) {
  const value = (viewportWidth * percentage) / 100;
  return Math.round(value);
}

let zoomParameter = 0.7;
let imageZoom = 0.05;
if (Platform.OS === 'android') {
  zoomParameter = 0.6;
  imageZoom = 0.1;
  if (Screen.proportion === '16:10') {
    zoomParameter = 0.55;
  } else if (Screen.proportion === '4:3') {
    zoomParameter = 0.44;
  }
} else if (Screen.proportion === '4:3') {
  zoomParameter = 0.6;
}

export const slideHeight = Screen.height;
export const sliderWidth = Screen.width * zoomParameter;
// export const itemWidth = Platform.OS === 'ios' ? Screen.width - 120 : Screen.width - 180
export const itemWidth = Screen.width * zoomParameter;

const styles = StyleSheet.create({
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    // paddingHorizontal: 15,
    paddingBottom: 18, // needed for shadow
    // backgroundColor: 'red'
  },
  imageContainer: {
    flex: 1,
    // justifyContent: "center",
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageContainerEven: {
    backgroundColor: '#fff',
  },
  image: {
    // ...StyleSheet.absoluteFillObject,
    // height: Screen.moderateScale((Screen.width * (zoomParameter - 0.1)) * 2560 / 1440),
    // width: Screen.moderateScale(Screen.width * (zoomParameter - 0.1)),
    height: (Screen.width * (zoomParameter - imageZoom) * 2339) / 1654,
    width: Screen.width * (zoomParameter - imageZoom),
    resizeMode: 'cover',
  },
  radiusMaskEven: {
    backgroundColor: '#000',
  },
  textContainer: {
    justifyContent: 'center',
    paddingTop: 20 - 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  textContainerEven: {
    backgroundColor: '#000',
  },
  title: {
    color: '#000',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  titleEven: {
    color: 'white',
  },
  subtitle: {
    marginTop: 6,
    color: 'gray',
    fontSize: 12,
    fontStyle: 'italic',
  },
  subtitleEven: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  headerContainer: {
    alignItems: 'center',
  },
  headerText: {
    // fontSize: 24,
    // lineHeight: 33,
    paddingBottom: Screen.moderateScale(9),
    fontWeight: '300',
    color: Colors.pinkRed,
  },
});

export default class SliderCard extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    even: PropTypes.bool,
    parallax: PropTypes.bool,
    showHeader: PropTypes.bool,
    parallaxProps: PropTypes.object,
    containerStyle: PropTypes.object,
    imageStyle: PropTypes.object,
    parallaxFactor: PropTypes.number,
  };
  static defaultProps = {
    showHeader: false,
    parallaxFactor: 0.35,
    containerStyle: {},
    imageStyle: {},
    event: false,
    parallax: false,
  };

  get image() {
    const {
      data: { image },
      parallax,
      parallaxProps,
      even,
      parallaxFactor,
      imageStyle,
    } = this.props;

    return parallax ? (
      <ParallaxImage
        source={{ uri: image }}
        containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
        style={[styles.image, imageStyle]}
        parallaxFactor={parallaxFactor}
        showSpinner
        spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
        {...parallaxProps}
      />
    ) : (
      <Image source={{ uri: image }} style={styles.image} />
    );
  }

  get header() {
    const {
      data: { title },
      showHeader,
    } = this.props;
    if (showHeader) {
      return (
        <View style={styles.headerContainer}>
          <Title style={styles.headerText}>{title}</Title>
        </View>
      );
    }
    return <View />;
  }

  render() {
    const {
      data: { title, onPress },
      even,
    } = this.props;

    const uppercaseTitle = title ? (
      <Text style={[styles.title, even ? styles.titleEven : {}]} numberOfLines={2}>
        {title.toUpperCase()}
      </Text>
    ) : (
      false
    );

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.slideInnerContainer, this.props.containerStyle]}
        onPress={() => {
          if (onPress) {
            onPress();
          }
        }}
      >
        {this.header}
        <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
          {this.image}
          <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
        </View>
      </TouchableOpacity>
    );
  }
}