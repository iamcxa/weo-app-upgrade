import React from 'react';
import { throttle, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  Platform,
  FlatList,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Screen, StyleSheet, Date as d } from '~/Helper';
import { translate as t } from '~/Helpers/I18n';
import { Colors, Classes } from '~/Theme';
import Config from '~/Config';
import {
  TopicCard,
  AndroidBackKey,
  ListSeparator,
  BaseIconButton,
  BackToTopButton,
} from '~/Component';

import { SortOptionRow } from '~/Components/ListHeader';
import HyperlinkWrapper from '~/widget/HyperlinkWrapper';
import { getRoutePrefix } from '~/utils/route';

import PaginationHeader from './PaginationHeader';

const { CIRCLE_TYPE } = Config;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    height: Screen.height,
  },
  listContent: {
    paddingHorizontal: Screen.moderateScale(15),
    borderRadius: Screen.moderateScale(4),
    backgroundColor: Colors.blackFour,
  },
  listEmptyContainer: {
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  listEmptyMessage: {
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 30,
    color: Colors.white,
  },
  darkContainer: {
    backgroundColor: Colors.blackFour,
  },
  darkView: {
    backgroundColor: Colors.blackFour,
  },
  dark: {
    color: Colors.white,
    backgroundColor: Colors.blackFour,
  },
});

let Carousel = null;

class PeekTopicView extends React.PureComponent {
  static propTypes = {
    sceneKey: PropTypes.string.isRequired,
    routeName: PropTypes.string.isRequired,
    prevRoute: PropTypes.string.isRequired,
    sort: PropTypes.string.isRequired,

    belongsTo: PropTypes.oneOf([...Object.keys(CIRCLE_TYPE)]).isRequired,
    topics: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    circleList: PropTypes.array.isRequired,
    activeSlide: PropTypes.number.isRequired,
    handleShowHottest: PropTypes.func.isRequired,
    handleShowNewest: PropTypes.func.isRequired,
    handleSnapItemChange: PropTypes.func.isRequired,
    handleBeforeSnapItemChange: PropTypes.func.isRequired,
    handleFetchTopics: PropTypes.func.isRequired,
    handleListReachEnd: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!Carousel) {
      Carousel = require('react-native-snap-carousel').default;
      return {
        isCarouselLoaded: true,
      };
    }
    if (Carousel) {
      return {
        isCarouselLoaded: true,
      };
    }
    return null;
  }

  getCircleData = () => {
    const { circleList, activeSlide } = this.props;
    const circle = circleList[activeSlide];
    return circle;
  };

  state = {
    circleData: null,
    isScrollAtTop: true,
    isCarouselLoaded: false,
  };

  // REQUIRED for ReactNativePagination to work correctly
  onViewableItemsChanged = ({ viewableItems, changed }) => {
    // console.log('changed=>', changed);
    this.setState({ viewableItems: viewableItems.slice(0) });
  };

  formatData = (list) =>
    Object.keys(list).map((key) => {
      const data = list[key];
      const time = d.humanize(data.createdAt);
      return {
        id: data.id,
        title: data.title,
        time,
        desc: data.content,
        likeNumber: data.vote.like,
        disLikeNumber: data.vote.dislike,
        belongsTo: this.props.belongsTo,
        authorName: data.memberName,
        authorHash: data.memberHash,
        replyCount: data.count,
        onPress: () => {
          Actions[`${getRoutePrefix()}_postList`]({
            statusBarColor: Colors.blackTwo,
            topicId: data.id,
            content: data.content,
            title: data.title,
            createdAt: time,
            avatar: data.memberAvatar,
            authorName: data.memberName,
            authorHash: data.memberHash,
            isPeekMode: true,
          });
        },
        likeOnPress: () => this.likeOnPress(data.id),
        disLikeOnPress: () => this.disLikeOnPress(data.id),
      };
    });

  handleScrollToTop = () => {
    if (this.scrollView) {
      this.scrollView.scrollTo({ x: 0, y: 0 });
    }
    if (this.list) {
      this.list.scrollToOffset({ animated: true, offset: 0 });
    }
  };

  handleListScroll = throttle((data) => {
    // console.log('handleListScroll data=>', data);
    if (data.contentOffset) {
      this.setState({
        isScrollAtTop: data.contentOffset.y === 0,
      });
    }
  }, 1000);

  handleBackToMap = () =>
    requestAnimationFrame(() => {
      const { activeSlide, circleList } = this.props;
      Actions.peekMapView({
        activeMarker: circleList[activeSlide],
      });
    });

  renderListItem = ({ item }) => <TopicCard dark {...item} />;

  renderListEmptyComponent = () => {
    const circleData = this.getCircleData();
    if (circleData && circleData.id) {
      return (
        <View style={[styles.listEmptyContainer, styles.darkView]}>
          <Text style={[styles.listEmptyMessage, styles.darkView]}>
            {t('peek_topic_list_list_is_empty')}
          </Text>
        </View>
      );
    }
    return (
      <View style={[styles.listEmptyContainer, styles.darkContainer]}>
        <HyperlinkWrapper style={[styles.listEmptyMessage, styles.darkContainer]}>
          <Text style={styles.dark}>{t('peek_topic_list_location_not_support')}</Text>
        </HyperlinkWrapper>
      </View>
    );
  };

  renderSlideItem =
    (slideItemHeight, sort, topics) =>
    ({ item, index }) => {
      const {
        handleFetchTopics,
        handleShowNewest,
        handleShowHottest,
        handleListReachEnd,
        isFetching,
        activeSlide,
      } = this.props;
      return (
        <View style={Classes.fill}>
          <View style={{ height: Screen.verticalScale(32) }}>
            <SortOptionRow
              dark
              active={sort}
              showNewest={handleShowNewest}
              showHottest={handleShowHottest}
            />
          </View>
          <FlatList
            ref={(ref) => {
              this.list = ref;
            }}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={ListSeparator}
            keyExtractor={(e) => e.id}
            renderItem={this.renderListItem}
            data={this.formatData(topics)}
            ListEmptyComponent={this.renderListEmptyComponent}
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={() => handleFetchTopics({ curPage: 1 })}
                enable={!isFetching}
              />
            }
            onScroll={this.handleListScroll}
            onEndReached={!isFetching ? handleListReachEnd : undefined}
            onEndReachedThreshold={0.5}
          />
        </View>
      );
    };

  renderContent = ({ topics, sort, circleList, viewableItems }) => {
    const buttonHeight = Screen.height - Screen.verticalScale(300);
    const slideItemHeight = Screen.height - Screen.verticalScale(32);
    const slideHeight = Screen.height - Screen.verticalScale(80);
    const slideItemWidth = Screen.width - Screen.scale(64);

    const { handleSnapItemChange, handleBeforeSnapItemChange, activeSlide, isFetching } =
      this.props;
    const { isCarouselLoaded } = this.state;
    return isCarouselLoaded ? (
      <View style={Classes.fillRow}>
        <BaseIconButton
          height={buttonHeight}
          iconName="ios-arrow-back"
          iconColor={Colors.pureWhite}
          disabled={isFetching}
          // disabled={activeSlide === 0 || isFetching}
          onPress={() => {
            handleBeforeSnapItemChange();
            // handleSnapItemChange(activeSlide - 1);
            this._carousel.snapToPrev(false);
          }}
          transparent
        />
        <Carousel
          loop
          // bounces
          layout="default"
          decelerationRate="fast"
          enableSnap
          lockScrollWhileSnapping
          windowSize={3}
          loopClonesPerSide={2}
          initialNumToRender={1}
          enableMomentum={false}
          ref={(c) => {
            this._carousel = c;
          }}
          slideStyle={{
            paddingHorizontal: Screen.scale(8),
            // height: Screen.height - Screen.verticalScale(70),
          }}
          contentContainerStyle={{
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            // height: Screen.height - Screen.verticalScale(300),
          }}
          scrollEventThrottle={150}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          data={circleList}
          renderItem={this.renderSlideItem(slideItemHeight, sort, topics)}
          sliderHeight={slideHeight}
          sliderWidth={slideItemWidth}
          itemWidth={slideItemWidth}
          itemHeight={slideItemHeight}
          onSnapToItem={handleSnapItemChange}
          onBeforeSnapToItem={handleBeforeSnapItemChange}
          onViewableItemsChanged={this.onViewableItemsChanged}
        />
        <BaseIconButton
          height={buttonHeight}
          iconName="ios-arrow-forward"
          iconColor={Colors.pureWhite}
          // disabled={circleList.length - 1 === activeSlide || isFetching}
          disabled={isFetching}
          onPress={() => {
            handleBeforeSnapItemChange();
            // handleSnapItemChange(activeSlide + 1);
            this._carousel.snapToNext(false);
          }}
          transparent
        />
      </View>
    ) : (
      <View style={Classes.fillCenter}>
        <ActivityIndicator color="white" size="large" animating />
      </View>
    );
  };

  render() {
    const { sort, activeSlide, topics, circleList, isFetching } = this.props;
    const { viewableItems, isScrollAtTop } = this.state;
    // console.log('insideCircles=>', insideCircles);
    return (
      <SafeAreaView style={styles.container}>
        <AndroidBackKey onBackKeyPress={this.handleBackToMap} />
        <PaginationHeader
          entries={circleList}
          activeSlide={activeSlide}
          isFetching={isFetching}
          backToMap={this.handleBackToMap}
        />
        {this.renderContent({ sort, topics, circleList, viewableItems })}
        {!isScrollAtTop && Platform.OS === 'android' && (
          <BackToTopButton onPress={this.handleScrollToTop} />
        )}
      </SafeAreaView>
    );
  }
}

export default PeekTopicView;
