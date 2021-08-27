import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SliderCard, { sliderWidth, itemWidth, sliderHeight } from '~/Components/SliderCard';

import Colors from '~/Theme/Colors';
import CheckboxList from '~/Components/CheckboxList';
import Screen from '../../utils/screen';

const { width, height } = Screen;

const images = [
  {
    image: 'https://pbs.twimg.com/media/Cg4L2t0UYAAgHCD.jpg:large',
    title: 'NY Summer Guide',
  },
  {
    image: 'https://pbs.twimg.com/media/Cg4L2t0UYAAgHCD.jpg:large',
    title: 'NY Summer Guide',
  },
  {
    image: 'https://pbs.twimg.com/media/Cg4L2t0UYAAgHCD.jpg:large',
    title: 'NY Summer Guide',
  },
  {
    image: 'https://pbs.twimg.com/media/Cg4L2t0UYAAgHCD.jpg:large',
    title: 'NY Summer Guide',
  },
  {
    image: 'https://pbs.twimg.com/media/Cg4L2t0UYAAgHCD.jpg:large',
    title: 'NY Summer Guide',
  },
  {
    image: 'https://pbs.twimg.com/media/Cg4L2t0UYAAgHCD.jpg:large',
    title: 'NY Summer Guide',
  },
  {
    image: 'https://pbs.twimg.com/media/Cg4L2t0UYAAgHCD.jpg:large',
    title: 'NY Summer Guide',
  },
  {
    image: 'https://pbs.twimg.com/media/Cg4L2t0UYAAgHCD.jpg:large',
    title: 'NY Summer Guide',
  },
  {
    image: 'https://pbs.twimg.com/media/Cg4L2t0UYAAgHCD.jpg:large',
    title: '正妹4',
  },
];

const newItemWidth = itemWidth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 30,
  },
});

export default class Gec2 extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      checked: false,
      slider1ActiveSlide: 0,
    };
  }

  getCheckedData = ({ index, value, id }) => {
    console.log(index, value, id);
  };

  _renderItem = ({ item, index }, parallaxProps) => (
    <SliderCard
      showHeader
      data={item}
      even={(index + 1) % 2 === 0}
      parallax={false}
      parallaxProps={parallaxProps}
      containerStyle={{ height, width: newItemWidth }}
      parallaxFactor={0.7}
      imageStyle={{ width: (width * 5) / 10 }}
    />
  );

  get pagination() {
    return (
      <Pagination
        dotsLength={Images.length}
        tappableDots
        activeDotIndex={this.state.slider1ActiveSlide}
        containerStyle={{ height: 15, width: 115 }}
        dotContainerStyle={{
          width: 5,
          height: 5,
          marginHorizontal: 2,
        }}
        dotStyle={{
          width: 5,
          height: 5,
          borderRadius: 5,
        }}
        inactiveDotStyle={{
          width: 5,
          height: 5,
        }}
        dotColor="rgba(13,64,121,1)"
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Carousel
          hasParallaxImages
          ref={(c) => {
            this._carousel = c;
          }}
          data={images}
          sliderWidth={sliderWidth}
          itemWidth={newItemWidth}
          inactiveSlideScale={0.7}
          inactiveSlideOpacity={0.8}
          sliderHeight={sliderHeight}
          containerCustomStyle={{ marginTop: 10 }}
          contentContainerCustomStyle={{}}
          enableMomentum={false}
          onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
          renderItem={this._renderItem}
        />
        {this.pagination}
      </View>
    );
  }
}
