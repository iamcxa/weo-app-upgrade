import React from 'react';
import PropTypes from 'prop-types';
import { RefreshControl, SafeAreaView, View, FlatList, Platform, Text } from 'react-native';
import { isEmpty, debounce } from 'lodash';
import { Actions } from 'react-native-router-flux';

import {
  CollapsibleHeader,
  BackToTopButton,
  ListSeparator,
  ListHeader,
  Separator,
  TopicCard,
} from '~/Components';
import { Colors, Metrics, Classes } from '~/Theme';
import { translate as t } from '~/Helpers/I18n';
import { ifIphoneX, Screen, Date as d, StyleSheet, Permission } from '~/Helpers';
import { PrimaryBtn } from '~/widget/RoundButton';
import HyperlinkWrapper from '~/widget/HyperlinkWrapper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.select({
      ios: ifIphoneX(-Metrics.baseVerticalMargin * 2, -Metrics.baseVerticalMargin * 1.5),
    }),
  },
  listContainer: {
    backgroundColor: Colors.pureWhite,
    borderRadius: Screen.moderateScale(4),
    elevation: 1,
    flex: 1,
    marginHorizontal: Screen.moderateScale(16),
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: Screen.moderateScale(-1),
    },
    shadowOpacity: 1,
    shadowRadius: Screen.moderateScale(6),
    marginBottom: Metrics.baseMargin * 2,
  },
  listContent: {
    paddingHorizontal: Metrics.baseMargin * 2,
    // paddingVertical: Screen.moderateScale(10),
    borderRadius: Screen.moderateScale(4),
    backgroundColor: Colors.pureWhite,
    zIndex: 99999,
  },
  listEmptyContainer: {
    // alignItems: 'center',
    justifyContent: 'center',
    padding: Metrics.baseMargin,
    margin: Metrics.baseMargin,
    flex: 1,
  },
  listEmptyMessage: {
    alignSelf: 'center',
    lineHeight: 30,
    textAlign: 'center',
    width: '100%',
  },
  txtNoPermissionDesc: {
    color: Colors.greyishBrownTwo,
    textAlign: 'center',
    alignSelf: 'center',
    marginVertical: Metrics.baseMargin * 2,
  },
  btnNoPermission: {
    marginHorizontal: Metrics.baseMargin * 2,
    marginBottom: Metrics.baseMargin * 3,
  },
});

class TopicView extends React.PureComponent {
  static propTypes = {
    // fetchGetTopics: PropTypes.func.isRequired,
    topics: PropTypes.array,
    homeCircle: PropTypes.object,
    currentCircle: PropTypes.object,
    insideCircles: PropTypes.array,
    userCircle: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    hasGeolocationPermission: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    homeCircle: {},
    currentCircle: {},
    insideCircles: [],
    userCircle: {},
    leftCircleTime: null,
  };

  state = {
    // curPage: 1,
    // isEnd: false,
    // sort: 'newest',
    // // favCircle: null,
    // refreshing: true,
    isScrollAtTop: true,
    // selectCircleId: null,
    // isEnterNewCircle: false,
    // currentInsideCircles: [],
  };

  onEndReachedCalledDuringMomentum = false;

  formatData = (list) =>
    list.map((key) => {
      const { id, title, content, vote, memberName, memberHash, memberAvatar, count, createdAt } =
        this.props.topicsById[key];
      const time = d.humanize(createdAt);
      return {
        id,
        title,
        time,
        desc: content,
        likeNumber: vote.like,
        disLikeNumber: vote.dislike,
        belongsTo: this.props.belongsTo,
        authorName: memberName,
        authorHash: memberHash,
        replyCount: count,
        onPress: () => {
          // this.props.updateLoading(true);
          const { belongsTo } = this.props;
          Actions.postList({
            topicId: id,
            content,
            title,
            createdAt: time,
            avatar: memberAvatar,
            authorName: memberName,
            authorHash: memberHash,
            belongsTo,
          });
        },
        likeOnPress: () => this.likeOnPress(id),
        disLikeOnPress: () => this.disLikeOnPress(id),
      };
    });

  handleScrollToTop = () => {
    if (this.scrollView) {
      this.scrollView.scrollTo({ x: 0, y: 0 });
    }
  };

  handleOnListScroll = debounce(({ contentOffset }) => {
    this.setState({
      isScrollAtTop: contentOffset.y === 0,
    });
  }, 500);

  renderItem = ({ item }) => {
    return <TopicCard {...item} />;
  };

  renderListEmptyComponent = () => {
    const { currentCircle, hasGeolocationPermission } = this.props;
    if (!hasGeolocationPermission) {
      return (
        <View style={styles.listEmptyContainer}>
          <Text style={styles.txtNoPermissionDesc}>{t('topic_list_no_location_permission_1')}</Text>
          <PrimaryBtn
            btnColor={Colors.mainYellow}
            textColor={Colors.black}
            onPress={Permission.requestGeolocationPermission}
            text={t('topic_list_no_location_permission_enable_location')}
            style={styles.btnNoPermission}
          />

          <Separator color={Colors.greyish} width="90%" />
          <Text style={styles.txtNoPermissionDesc}>{t('topic_list_no_location_permission_2')}</Text>
          <PrimaryBtn
            btnColor={Colors.mainYellow}
            textColor={Colors.black}
            onPress={Actions.peekMapView}
            text={t('peek_map_title_peek_only')}
            style={styles.btnNoPermission}
          />
        </View>
      );
    }
    if (isEmpty(currentCircle)) {
      return (
        <View style={Classes.paddingBottom}>
          <View style={styles.listEmptyContainer}>
            <Text style={styles.listEmptyMessage}>{t('topic_list_no_circle')}</Text>
          </View>

          <Separator color={Colors.greyish} width="90%" />
          <View style={Classes.marginBottom}>
            <Text style={styles.txtNoPermissionDesc}>
              {t('topic_list_no_location_permission_2')}
            </Text>

            <PrimaryBtn
              btnColor={Colors.mainYellow}
              textColor={Colors.black}
              onPress={Actions.peekMapView}
              text={t('peek_map_title_peek_only')}
              style={styles.btnNoPermission}
            />
          </View>
        </View>
      );
    }
    return (
      <View style={Classes.paddingBottom}>
        <View style={styles.listEmptyContainer}>
          <Text style={styles.listEmptyMessage}>{t('topic_list_empty')}</Text>
        </View>

        <Separator color={Colors.greyish} width="90%" />
        <View style={Classes.marginBottom}>
          <Text style={styles.txtNoPermissionDesc}>{t('topic_list_no_location_permission_2')}</Text>

          <PrimaryBtn
            btnColor={Colors.mainYellow}
            textColor={Colors.black}
            onPress={Actions.peekMapView}
            text={t('peek_map_title_peek_only')}
            style={styles.btnNoPermission}
          />
        </View>
      </View>
    );
    // return hasGeolocationPermission ? (
    //   <View style={styles.listEmptyContainer}>
    //     <HyperlinkWrapper style={styles.listEmptyMessage}>
    //       <Text>{t('topic_list_no_circle')}</Text>
    //     </HyperlinkWrapper>
    //   </View>
    // ) : (
    //   <View style={styles.listEmptyContainer}>
    //     <View
    //       style={[
    //         styles.listEmptyMessage,
    //         {
    //           marginTop: Metrics.baseMargin * 2,
    //           marginBottom: Metrics.baseMargin * 8,
    //         },
    //       ]}
    //     >
    //       <Text style={styles.txtNoPermissionDesc}>
    //         {t('topic_list_no_location_permission_1')}
    //       </Text>
    //       <PrimaryBtn
    //         btnColor={Colors.mainYellow}
    //         textColor={Colors.black}
    //         onPress={Permission.requestGeolocationPermission}
    //         text={t('topic_list_no_location_permission_enable_location')}
    //         style={styles.btnNoPermission}
    //       />

    //       <Separator color={Colors.greyish} width="90%" />

    //       <Text style={styles.txtNoPermissionDesc}>
    //         {t('topic_list_no_location_permission_2')}
    //       </Text>

    //       <PrimaryBtn
    //         btnColor={Colors.mainYellow}
    //         textColor={Colors.black}
    //         onPress={Actions.peekMapView}
    //         text={t('peek_map_title_peek_only')}
    //         style={styles.btnNoPermission}
    //       />
    //     </View>
    //   </View>
    // );
  };

  render() {
    const {
      isLoading,
      topics,
      homeCircle,
      currentCircle,
      insideCircles,
      userCircle,
      belongsTo,
      onRefresh,
      onEndReached,
      onShowNewest,
      onShowHottest,
      onSwitchCircle,
      onRootTabIndexChange,
      sort,
      total,
      curPage,

      onScrollEndDrag,
      onScrollBeginDrag,
    } = this.props;
    const { isScrollAtTop } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <CollapsibleHeader
          scrollViewRef={(ref) => {
            this.scrollView = ref;
          }}
          max={ifIphoneX(
            Screen.verticalScale(96),
            Platform.OS === 'ios' ? Screen.verticalScale(108) : Screen.verticalScale(108),
          )}
          min={false}
          renderHeader={
            <ListHeader
              insideCircles={insideCircles}
              selectedCircle={userCircle}
              homeCircle={homeCircle}
              active={sort}
              showNewest={onShowNewest}
              showHottest={onShowHottest}
              belongsTo={belongsTo}
              onSwitchCircle={onSwitchCircle}
              onRootTabIndexChange={onRootTabIndexChange}
              isLoading={isLoading}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={Platform.OS === 'android' && isLoading}
              onRefresh={onRefresh}
              enable
            />
          }
          onScroll={this.handleOnListScroll}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.7}
          content={
            <View style={styles.listContainer}>
              <FlatList
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={ListSeparator}
                keyExtractor={(item) => item.id}
                renderItem={this.renderItem}
                data={this.formatData(topics)}
                onMomentumScrollBegin={() => {
                  this.onEndReachedCalledDuringMomentum = false;
                }}
                ListEmptyComponent={this.renderListEmptyComponent}
                onScrollEndDrag={onScrollEndDrag}
                onScrollBeginDrag={onScrollBeginDrag}
                windowSize={31}
                initialNumToRender={50}
                maxToRenderPerBatch={10}
              />
            </View>
          }
        />
        {!isScrollAtTop && Platform.OS === 'android' && (
          <BackToTopButton onPress={this.handleScrollToTop} />
        )}
      </SafeAreaView>
    );
  }
}

export default TopicView;
