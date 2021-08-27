import React, { Component } from 'react';
import { Text, View, Animated, ScrollView, Dimensions } from 'react-native';
import Modal from './BaseLightbox';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

export default class Hello extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.scrollY = new Animated.Value(0);
  }

  render() {
    const headerHeight = this.scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [300, 0],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });

    console.log(headerHeight);

    return (
      <Modal hideClose verticalPercent={0.5} horizontalPercent={0.5} onClose={this.props.onClose}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: '#ebebeb',
            width: ScreenWidth,
            height: ScreenHeight,
          }}
          scrollEventThrottle={1}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  y: this.scrollY,
                },
              },
            },
          ])}
        >
          {/* 視差效果 1. */}
          <Animated.View
            style={{
              height: headerHeight,
              alignItem: 'center',
            }}
          >
            <Animated.Image
              style={{
                height: 300,
                width: '100%',
              }}
              source={{ uri: this.props.image }}
              resizeMode="cover"
            />
          </Animated.View>

          {/* 視差效果 2 */}
          {/* <Animated.Image
            style={{
              height: headerHeight,
              width: '100%',
            }}
            source={{ uri: 'https://picsum.photos/1920/1080/?image=923' }}
            resizeMode={'cover'}
          /> */}

          <View style={{ height: 1000, backgroundColor: '#ccc' }} />
        </ScrollView>
      </Modal>
    );
  }
}
