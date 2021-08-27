import _ from 'lodash';
import React, { Component } from 'react';
import { RefreshControl, Animated, Platform, ScrollView, View } from 'react-native';
import PropTypes from 'prop-types';
import Screen from 'App/utils/screen';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const isCloseToBottom = (
  { layoutMeasurement, contentOffset, contentSize },
  onEndReachedThreshold,
) => layoutMeasurement.height + contentOffset.y >= contentSize.height * (1 - onEndReachedThreshold);

export default class Collapsible extends Component {
  static propTypes = {
    onEndReached: PropTypes.func,
    onEndReachedThreshold: PropTypes.number,
    scrollViewRef: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onEndReached: null,
    onEndReachedThreshold: 0.3,
  };

  scroll = new Animated.Value(0);

  offset = new Animated.Value(0);

  min = this.props.min === false ? 0 : Platform.select({ ios: 20, android: 0 });

  max = (this.props.max || 44) + this.min;

  position = Animated.add(this.scroll, this.offset).interpolate({
    inputRange: [-1 * this.max, 0, this.max],
    outputRange: [-1 * (this.min - this.max), 0, this.min - this.max],
    extrapolate: 'clamp',
  });

  opacity = this.scroll.interpolate({
    inputRange: [0, this.max],
    outputRange: [1, 0],
  });

  height = this.scroll.interpolate({
    inputRange: [-1 * this.max, 0, this.max],
    outputRange: [this.max, this.max, this.max],
  });

  render() {
    const { backgroundColor, contentWrapperStyle, renderHeader, fixedHeader, ...props } =
      this.props;
    return (
      <View style={{ flex: 1, overflow: 'hidden' }}>
        {fixedHeader}
        <ScrollView
          ref={this.props.scrollViewRef}
          {...props}
          contentContainerStyle={{ paddingTop: renderHeader ? this.max : 0 }}
          // onScroll={Animated.event([
          //   { nativeEvent: { contentOffset: { y: this.scroll } } }
          // ])}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent, this.props.onEndReachedThreshold)) {
              this.props.onEndReached();
            }
            if (typeof this.props.onScroll === 'function') {
              this.props.onScroll(nativeEvent);
            }
          }}
          scrollEventThrottle={16}
          // onScroll={() => { console.log('onScroll'); }}
          // scrollEventThrottle={1}
          // style={{ zIndex: 1 }}
        >
          <Animated.View
            style={{
              backgroundColor,
              // height: this.props.bounce === false ? this.max : this.height,
              height: this.max,
              left: 0,
              paddingTop: this.min,
              position: 'absolute',
              right: 0,
              top: 0,
              // transform: [{ translateY: this.position }],
              zIndex: 2,
            }}
          >
            <Animated.View
              style={{
                flex: 1,
                opacity: this.opacity,
                justifyContent: 'center',
              }}
            >
              {renderHeader}
            </Animated.View>
          </Animated.View>

          <View style={[{ flex: 1 }, contentWrapperStyle]}>{this.props.content}</View>
        </ScrollView>
      </View>
    );
  }
}
