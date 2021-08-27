import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, View } from 'react-native';
import Image from 'react-native-image-cache-wrapper';
import { Screen, StyleSheet } from 'App/Helpers';

const styles = StyleSheet.create({
  imageContainer: {
    marginBottom: Screen.verticalScale(16),
    flex: 1,
    width: '100%',
    height: 'auto',
    maxHeight: 400,
    // height: 400,
    minHeight: 200,
  },
  image: {
    // flex: 1,
    width: '100%',
    maxHeight: 400,
    // height: 400,
    minHeight: 200,
    alignSelf: 'center',
  },
});

class CommentCardImage extends React.PureComponent {
  static propTypes = {
    mediaUrl: PropTypes.string.isRequired,
    getImageContainerSize: PropTypes.func,
    getImageHeight: PropTypes.func,
    imageContainerWidth: PropTypes.any,
    imageRatio: PropTypes.number,
  };

  static defaultProps = {
    getImageContainerSize: () => {},
    getImageHeight: () => {},
    imageContainerWidth: Screen.width - Screen.scale(96),
    imageRatio: 1,
  };

  state = {
    imageContainerHeight: 200,
    imageContainerWidth: Screen.width - Screen.scale(96),
    imageRatio: 1,
    isImagePerfected: false,
  };

  componentWillMount() {
    const { mediaUrl } = this.props;
    this.getCalculateImageRatio(mediaUrl);
  }

  getImageContainerSize = (event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    // this.setState({
    //   imageContainerHeight: height,
    // });
  };

  getCalculateImageRatio = (mediaUrl) => {
    const { getImageHeight } = this.props;
    Image.isUrlCached(mediaUrl, (exists) => {
      if (exists) {
        Image.getSize(mediaUrl, (width, height) => {
          const imageRatio = height / width;
          if (this.state.imageRatio !== imageRatio) {
            this.setState((state) => ({
              ...state,
              imageRatio,
            }));
          }
          this.setState({
            isImagePerfected: true,
          });
        });
      } else {
        Image.prefetch(mediaUrl, 604800, (cacheFile) => {
          Image.getSize(mediaUrl, (width, height) => {
            const imageRatio = height / width;
            if (this.state.imageRatio !== imageRatio) {
              this.setState((state) => ({
                ...state,
                imageRatio,
              }));
            }
            this.setState({
              isImagePerfected: true,
            });
          });
        });
      }
    });
  };

  render() {
    const { mediaUrl, getImageHeight } = this.props;
    const { imageContainerWidth, imageRatio, isImagePerfected } = this.state;
    const imgStyle = {
      width: imageContainerWidth,
      height: imageContainerWidth * imageRatio,
    };
    // console.log('imgStyle =>', imgStyle);
    getImageHeight(imgStyle.height);
    return mediaUrl ? (
      <View style={styles.imageContainer} onLayout={this.getImageContainerSize}>
        {isImagePerfected ? (
          <Image
            resizeMode="contain"
            source={{ uri: mediaUrl }}
            style={[styles.image, imgStyle]}
            activityIndicator={<ActivityIndicator size="large" animating />}
          />
        ) : (
          <ActivityIndicator size="large" animating />
        )}
      </View>
    ) : null;
  }
}

export default CommentCardImage;
