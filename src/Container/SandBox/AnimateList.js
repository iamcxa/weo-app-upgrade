import React, { Component } from 'react';
import { Text, View, Animated, ScrollView, TouchableOpacity } from 'react-native';
import AnimateTransition from './AnimateTransition';

const template = [
  '40%',
  '60%',
  '50%',
  '50%',
  '100%',
  '60%',
  '40%',
  '40%',
  '60%',
  '50%',
  '50%',
  '60%',
  '40%',
  '100%',
];

export default class Hello extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tW: 0,
      tH: 0,
      tX: 0,
      tY: 0,
      tUri: '',
      scrollViewPosition: 0,
    };
    this.scrollViewPosition = 0;
    this.image = {};
  }

  getImagePosition = (image, w, uri) => {
    if (image) {
      image.getNode().measure((soruceX, soruceY, width, height, pageX, pageY) => {
        console.log({
          width,
          height,
          pageX,
          pageY,
        });
        this.setState({
          tW: w,
          tH: height,
          tX: pageX,
          tY: this.scrollViewPosition + pageY,
          tUri: uri,
          scrollViewPosition: this.scrollViewPosition,
        });
      });
    }
  };

  renderImage = () =>
    template.map((w, i) => {
      const imageId = 900 + i;
      const uri = `https://picsum.photos/256/144/?image=${imageId}`;
      Image.prefetch(uri);
      return (
        <TouchableOpacity
          key={i}
          style={{ width: w, height: 200, padding: 2 }}
          onPress={() => {
            this.getImagePosition(this.image[i], w, uri);
          }}
        >
          <Animated.Image
            style={{
              flex: 1,
            }}
            ref={(ref) => (this.image[i] = ref)}
            source={{ uri }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    });

  render() {
    const { tW, tH, tX, tY, tV, tUri, scrollViewPosition } = this.state;
    return (
      <ScrollView
        scrollEventThrottle={16}
        onScroll={(e) => {
          console.log(e.nativeEvent.contentOffset.y);
          this.scrollViewPosition = e.nativeEvent.contentOffset.y;
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {this.renderImage()}
          <AnimateTransition
            width={tW}
            height={tH}
            x={tX}
            y={tY}
            scrollViewPosition={scrollViewPosition}
            image={tUri}
          />
        </View>
      </ScrollView>
    );
  }
}
