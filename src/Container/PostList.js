import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  KeyboardAvoidingView,
  RefreshControl,
  StatusBar,
  FlatList,
  StyleSheet,
  BackHandler,
  Keyboard,
  Animated,
  Platform,
  AppState,
  TouchableOpacity,
  Text,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import { translate as t } from '~/Helpers/I18n';
import { Date as d, Screen, ListenableEvent, ifIphoneX } from '~/Helpers';
import {
  MainNavBar,
  CommentCard,
  BackToTopButton,
  PostListFooter,
  ReplyBar,
  ReplyDialog,
} from '~/Components';
import { Colors, Fonts, Metrics } from '~/Theme';
import Config from '~/Config';
import {
  AppStore,
  PostActions,
  TopicActions,
  AppStateActions,
  AppAlertActions,
  ReportActions,
} from '~/Stores';

import { getStateKeyByBelongsTo } from '~/Stores/List/Reducers';
import { onUpdateList } from '~/Stores/List/Actions/list';
import { getRoutePrefix } from '../utils/route';
import BottomPopup from '../widget/BottomPopup';
import MoreMenu from '../widget/MoreMenu';

const { ON_END_REACHED_THROTTLE, CIRCLE_TYPE } = Config;

const AnimatedView = Animated.createAnimatedComponent(KeyboardAvoidingView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paleGrey,
  },
  replyBar: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.pureWhite,
  },
  listContent: {
    paddingHorizontal: Screen.scale(16),
    paddingBottom: Screen.scale(70),
  },
  listHeader: {
    backgroundColor: Colors.pureWhite,
    borderRadius: Screen.scale(4),
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: Screen.scale(6),
    shadowOpacity: 1,
  },
  listItem: {
    marginLeft: Screen.scale(13),
    borderLeftWidth: Screen.scale(1),
    borderBottomWidth: Screen.scale(1),
    borderColor: Colors.silver,
  },
  backToTop: {
    bottom: Screen.scale(66),
  },
  highlightPostBorder: {
    borderWidth: 1,
    borderColor: Colors.mainYellow,
  },
  peekModeContainer: {
    backgroundColor: Colors.blackTwo,
  },
  peekModeListHeader: {
    backgroundColor: Colors.greyishBrown,
    // borderColor: Colors.darkGray,
  },
  peekModeListItem: {
    color: Colors.white,
    backgroundColor: Colors.blackFour,
    borderColor: Colors.darkGray,
  },
  networkBox: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.black,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 899999,
    ...Platform.select({
      ios: ifIphoneX(
        {
          height: Screen.scale(80),
          paddingBottom: Metrics.baseMargin,
        },
        {
          height: Screen.scale(64),
        },
      ),
      android: {
        height: Screen.scale(64),
      },
    }),
  },
  message: {
    marginLeft: Metrics.baseMargin * 2,
    color: Colors.white,
    ...Fonts.style.regular,
  },
  retryBtn: {
    width: Screen.scale(82),
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    color: Colors.white,
    ...Fonts.style.regular,
  },
});

let isListScrolling = false;
let isComponentMounted = false;

class PostList extends React.Component {
  static propTypes = {
    handleUpdateList: PropTypes.func.isRequired,
    currentTimeZone: PropTypes.string.isRequired,
    sceneKey: PropTypes.string.isRequired,
    routeName: PropTypes.string.isRequired,
    prevRoute: PropTypes.string.isRequired,
    topic: PropTypes.object,
    storeTopic: PropTypes.object,
    posts: PropTypes.array.isRequired,
    postsById: PropTypes.object.isRequired,
    topicId: PropTypes.string.isRequired,
    content: PropTypes.string,
    postId: PropTypes.string,
    title: PropTypes.string,
    updatePost: PropTypes.func.isRequired,
    deleteTopicById: PropTypes.func.isRequired,
    resetPost: PropTypes.func.isRequired,
    replaceTopics: PropTypes.func.isRequired,
    createPost: PropTypes.func.isRequired,
    updateTopicByKey: PropTypes.func.isRequired,
    circleName: PropTypes.string,
    updateLoading: PropTypes.func.isRequired,
    belongsTo: PropTypes.oneOf(['HERE_YOU_ARE', 'THERE_YOU_ARE', 'BROWSE']),
    highlightHeader: PropTypes.bool,
    isPeekMode: PropTypes.bool,
    fetchGetPost: PropTypes.func.isRequired,
    fetchPostHidePost: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    updatePostByKey: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
    isInternetReachable: PropTypes.bool.isRequired,

    userCircle: PropTypes.object,
    homeCircle: PropTypes.object,
  };

  static defaultProps = {
    postId: null,
    highlightHeader: false,
    topic: {},
    storeTopic: {},
    content: '',
    title: '',
    circleName: '',
    belongsTo: 'THERE_YOU_ARE',
    isPeekMode: false,
    userCircle: {},
    homeCircle: {},
  };

  constructor(props) {
    super(props);
    this.keyboardHeight = new Animated.Value(0);
  }

  state = {
    refreshing: true,
    curPage: 1,
    isEnd: false,
    appState: AppState.currentState,
    // topic: null,
    newPostId: null,
    popupPostVisible: false,
    popupPostId: null,
    replyToId: this.props.topicId,
    replyType: 'POST',
    replyToAuthorName: '',
    isScrollAtTop: true,
    backToScreen: undefined,
    isShowAlert: null,
  };

  componentDidMount() {
    this.props.resetPost(this.props.belongsTo);
    this.onRefresh();
    this.keyboardShowSub = Keyboard.addListener(ListenableEvent.KEYBOARD_SHOW, this.keyboardShow);
    this.keyboardHideSub = Keyboard.addListener(ListenableEvent.KEYBOARD_HIDE, this.keyboardHide);
    if (Platform.OS === 'android') {
      this.backHandler = BackHandler.addEventListener(
        ListenableEvent.HARDWARE_BACK_PRESS,
        () => Actions.pop() && true,
      );
    }
    this.routePrefix = getRoutePrefix();

    this.props.updateLoading(false);

    setTimeout(() => {
      // 如果有 postId，表示由 SearchScreen 進來的
      if (isComponentMounted && this.postList && this.props.postId) {
        const target = this.props.posts.find((e) => e === this.props.postId);
        const postIndex = this.props.posts.indexOf(target);
        this.postList.scrollToIndex({
          animated: true,
          index: postIndex,
        });
      }
    }, 1500);

    isComponentMounted = true;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { sceneKey, routeName } = this.props;
    // console.log('sceneKey=>', sceneKey);
    // console.log('routeName=>', routeName);
    // console.log('isComponentMounted=>', isComponentMounted);
    // console.log('is post list?', sceneKey.includes(nextProps.routeName));
    if (sceneKey.includes(nextProps.routeName)) {
      isComponentMounted = true;
    } else {
      isComponentMounted = false;
    }
    setTimeout(() => {
      if (isComponentMounted && !nextState.isShowAlert && !nextProps.isInternetReachable) {
        this.setState({
          isShowAlert: true,
        });
      }
    }, 1000);
    return (
      !isListScrolling &&
      isComponentMounted &&
      sceneKey.includes(routeName) &&
      (!_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState))
    );
  }

  componentDidUpdate(prevProps) {
    const { sceneKey, routeName, prevRoute } = this.props;
    // 如果上一頁是 voiceView，則返回時要跳回 here you are
    if (
      isComponentMounted &&
      prevRoute !== routeName &&
      prevRoute === 'voiceView' &&
      sceneKey.includes(routeName)
    ) {
      this.setState({
        backToScreen: 'voiceView',
      });
    }
  }

  componentWillUnmount() {
    this.keyboardShowSub && this.keyboardShowSub.remove();
    this.keyboardHideSub && this.keyboardHideSub.remove();

    if (Platform.OS === 'android') {
      this.backHandler.remove();
    }

    isComponentMounted = false;
  }

  onNavLeftOnPress = () => {
    const { belongsTo } = this.props;
    const { backToScreen } = this.state;
    switch (backToScreen) {
      case 'voiceView':
        requestAnimationFrame(() => {
          if (belongsTo === CIRCLE_TYPE.THERE_YOU_ARE) {
            Actions.thereYouAre({
              hideTabBar: false,
              statusBarColor: Colors.paleGrey,
              type: 'jump',
            });
          } else {
            Actions.hereYouAre({
              hideTabBar: false,
              statusBarColor: Colors.paleGrey,
              type: 'jump',
            });
          }
        });
        break;

      default:
        requestAnimationFrame(Actions.pop);
        break;
    }
    this.setState({
      backToScreen: undefined,
    });
    const { handleUpdateList } = this.props;
    handleUpdateList({
      isRefresh: true,
      isBackToTop: true,
    });
  };

  onRefresh = () => {
    // Actions.tabTopicView({ type: 'refresh', swipeEnabled: false });
    this.setState(
      {
        refreshing: true,
        curPage: 1,
        isEnd: false,
      },
      () => {
        this.getPostList();
      },
    );
  };

  onReplySuccess = (res, id, type) => {
    const {
      replaceTopics,
      updateTopicByKey,
      topicId,
      belongsTo,
      createPost,
      topic,
      updatePost,
      postsById,
      updatePostByKey,
    } = this.props;
    if (this.state.curPage === res.data.paging.lastPage) {
      updatePost(belongsTo, { ...res.data });
      // const data = {
      //   [res.data.id]: res.data,
      // };
      if (type === 'REPLY') {
        updatePostByKey({
          belongsTo,
          key: id,
          data: { ...postsById[id], count: postsById[id].count + 1 },
        });
      }
      this.setState({
        newPostId: res.data.id,
        replyToId: topicId,
        replyType: 'POST',
        replyToAuthorName: '',
      });

      const targetList = getStateKeyByBelongsTo(belongsTo);
      const listSortType = _.get(AppStore.getState(), `${targetList}.topics.paging.by`);

      createPost({ target: belongsTo, data: res.data });
      updateTopicByKey({
        belongsTo,
        key: topic.id,
        data: {
          ...topic,
          count: topic.count + 1,
        },
        sortBy: listSortType,
      });
      // 前端排序
      if (listSortType === 'hottest') {
        const allTopics = _.get(AppStore.getState(), `${targetList}.topics.byId`);
        // console.log('allTopics=>', allTopics);
        const sortedTopics = Object.values(allTopics).sort(function (a, b) {
          return b.count - a.count;
        });
        // console.log('sortedTopics=>', sortedTopics);
        replaceTopics({
          belongsTo,
          data: _.keyBy(sortedTopics, 'id'),
        });
      }
      this.scrollToLast();
    }
  };

  onReportSubmit = async () => {
    this.BottomPopup.close();
    const { type, id } = this.focusedMoreItem;
    Actions.report({
      id,
      postType: type,
    });
  };

  onEndReached = _.throttle(async () => {
    // if (!this.onEndReachedCalledDuringMomentum && !this.state.isEnd) {
    const { curPage, isEnd } = this.state;
    console.log('onEndReached ============?');
    if (curPage > 0) {
      await this.getPostList();
    }
  }, ON_END_REACHED_THROTTLE);

  onHidePost = () => {
    this.BottomPopup.close();
    this.setState({ refreshing: true });
    const { type, id } = this.focusedMoreItem;
    const { fetchPostHidePost, belongsTo } = this.props;
    fetchPostHidePost(id, type, belongsTo);
  };

  getPostList = () => {
    const { curPage } = this.state;
    const { fetchGetPost, topicId, belongsTo } = this.props;
    const handleNextPage = () => {
      this.setState({ curPage: curPage + 1 });
    };
    fetchGetPost({ topicId, curPage, belongsTo, handleNextPage });
  };

  formatData = (list, currentTimeZone) =>
    list.map((key) => {
      const data = this.props.postsById[key];
      if (!_.isEmpty(data) && data.id) {
        const time = d.humanize(data.createdAt, currentTimeZone);
        return {
          ...data,
          type: 'POST',
          id: data.id,
          title: data.title,
          createdAt: time,
          content: data.content,
          avatar: data.memberAvatar,
          authorName: data.memberName,
          authorHash: data.memberHash,
          replies: data.replies,
          paging: data.paging,
          belongsTo: this.props.belongsTo,
          onReplyPress: () => {
            Actions[`${this.routePrefix}_replyList`]({
              postId: data.id,
              content: data.content,
              title: 'REPLY',
              createdAt: time,
              avatar: data.memberAvatar,
              authorName: data.memberName,
              authorHash: data.memberHash,
              refreshPost: this.onRefresh,
              topic: this.props.topic,
            });
          },
          onPress: () => {},
          onMoreBtnPress: () => {
            this.focusedMoreItem = {
              type: 'POST',
              id: data.id,
            };
            this.BottomPopup.open();
          },
        };
      }
    });

  keyExtractor = (data) => data.id;

  keyboardShow = (event) => {
    if (Platform.OS === 'ios') {
      Animated.timing(this.keyboardHeight, {
        toValue: event.endCoordinates.height,
        duration: 150,
      }).start();
    }
  };

  keyboardHide = () => {
    if (Platform.OS === 'ios') {
      Animated.timing(this.keyboardHeight, {
        toValue: 0,
        duration: 100,
      }).start();
    }
  };

  scrollToTop = () => {
    if (this.postList) {
      this.postList.scrollToOffset(0);
    }
  };

  scrollToLast = () => {
    if (isComponentMounted && this.postList) {
      setTimeout(() => {
        // this.postList.scrollToIndex({
        //   viewOffset: -10,
        //   index: Object
        //     .keys(this.props.posts).length - 1,
        // });
        this.postList.scrollToEnd({
          animated: false,
        });
      }, 250);
    }
  };

  clearFocusedMoreItem = () => {
    this.focusedMoreItem = null;
  };

  scrollDenouncer = null;

  onListScroll = ({ nativeEvent: { contentOffset } }) => {
    this.scrollDenouncer = _.debounce(() => {
      this.setState({
        isScrollAtTop: contentOffset.y === 0,
      });
    }, 1000)();
  };

  renderListHeader = () => {
    const {
      topic,
      topicId,
      belongsTo,
      isPeekMode,
      userCircle,
      homeCircle,
      highlightHeader,
      currentTimeZone,
    } = this.props;
    // console.log('getRoutePrefix()=>', getRoutePrefix());
    return (
      <CommentCard
        {...topic}
        listHeader
        id={topicId}
        style={[
          styles.listHeader,
          highlightHeader
            ? {
                borderWidth: 1,
                borderColor: Colors.mainYellow,
              }
            : {},
          isPeekMode ? styles.peekModeListHeader : undefined,
        ]}
        type="TOPIC"
        isPeekMode={isPeekMode}
        belongsTo={belongsTo}
        userCircle={userCircle}
        homeCircle={homeCircle}
        authorName={topic.memberName}
        authorHash={topic.memberHash}
        avatar={topic.memberAvatar}
        createdAt={d.humanize(topic.createdAt, currentTimeZone)}
        onReplyPress={() => {
          this.setState({
            replyToId: topicId,
            replyType: 'POST',
            replyToAuthorName: `${topic.memberName}`,
          });
          this.replyBar.focus();
        }}
        repliesLength={this.props.topic.count}
        topic={this.props.topic}
        onMoreBtnPress={() => {
          this.focusedMoreItem = {
            type: 'TOPIC',
            id: this.props.topicId,
          };
          this.BottomPopup.open();
        }}
      />
    );
  };

  renderItem = ({ item }) => {
    const { topic, isPeekMode, postId } = this.props;
    const { newPostId } = this.state;
    return (
      <CommentCard
        {...item}
        isPeekMode={isPeekMode}
        isHideFooter={isPeekMode}
        // mediaUrl={item.mediaUrl}
        style={[
          styles.listItem,
          (newPostId === item.id || (!newPostId && postId === item.id)) &&
            styles.highlightPostBorder,
          isPeekMode && styles.peekModeListItem,
        ]}
        repliesLength={item.count}
        topic={topic}
        onReplyPress={() => {
          this.setState({
            replyToId: item.id,
            replyType: 'REPLY',
            replyToAuthorName: `${item.memberName}`,
          });
          this.replyBar.focus();
        }}
        onPressPopupOriginPost={(popupPostId) => {
          this.setState({
            popupPostVisible: true,
            popupPostId,
          });
        }}
      />
    );
  };

  onPressRetry = () => {
    this.setState({
      isShowAlert: false,
    });
    this.onRefresh();
  };

  render() {
    const { title, topic, posts, isLoading, belongsTo, isPeekMode, currentTimeZone } = this.props;
    const { replyToId, replyType, replyToAuthorName, isScrollAtTop, isShowAlert } = this.state;
    // console.log('posts=>', posts);
    // const ITEM_HEIGHT = 200;
    return (
      <AnimatedView
        style={[
          styles.container,
          { paddingBottom: this.keyboardHeight },
          isPeekMode && styles.peekModeContainer,
        ]}
      >
        {isPeekMode ? (
          <StatusBar backgroundColor={Colors.blackFour} barStyle="light-content" />
        ) : (
          <StatusBar backgroundColor={Colors.paleGrey} barStyle="dark-content" />
        )}
        <MainNavBar
          leftOnPress={this.onNavLeftOnPress}
          title={title || topic.title}
          titleStyle={
            isPeekMode
              ? {
                  color: Colors.white,
                }
              : {}
          }
          style={{
            paddingHorizontal: 0,
            marginBottom: Screen.verticalScale(8),
          }}
          numberOfLines={5}
          // leftOnPress={Actions[`${getRoutePrefix()}_topicList`]}
        />
        <FlatList
          ref={(ref) => {
            this.postList = ref;
          }}
          // getItemLayout={(data, index) => (
          //   {
          //     length: ITEM_HEIGHT,
          //     offset: ITEM_HEIGHT * index,
          //     index,
          //   }
          // )}
          onScroll={this.onListScroll}
          onScrollEndDrag={() => {
            isListScrolling = false;
          }}
          onScrollBeginDrag={() => {
            isListScrolling = true;
          }}
          scrollEventThrottle={1000}
          data={this.formatData(posts, currentTimeZone)}
          keyExtractor={this.keyExtractor}
          ListHeaderComponent={this.renderListHeader}
          renderItem={this.renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={this.onRefresh} />}
          // onEndReached={this.onEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={PostListFooter}
        />
        <ReplyDialog
          belongsTo={belongsTo}
          visible={this.state.popupPostVisible}
          onTouchOutside={() => {
            this.setState({ popupPostVisible: false });
          }}
          replyPostId={this.state.popupPostId}
        />

        {isShowAlert !== null && (
          <Animatable.View
            animation={isShowAlert ? 'fadeInUp' : 'fadeOutDown'}
            duration={isShowAlert === null ? 0 : 1000}
            style={styles.networkBox}
            useNativeDriver
          >
            <Text style={styles.message} textTransform="textTransform">{`${t(
              '_fail_to_load_network_error',
            )}`}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={this.onPressRetry}>
              <Text style={styles.retryText}>{t('_retry')}</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
        {!isPeekMode && (
          <Animated.View style={[styles.replyBar, { bottom: this.keyboardHeight }]}>
            <ReplyBar
              ref={(ref) => {
                this.replyBar = ref;
              }}
              id={replyToId}
              topicId={topic.id}
              type={replyType}
              replyToAuthorName={replyToAuthorName}
              onRemoveReplyToAuthorName={() =>
                this.setState({
                  replyToId: null,
                  replyType: 'POST',
                  replyToAuthorName: '',
                })
              }
              onReplySuccess={this.onReplySuccess}
              maxLength={2000}
              maxTextInputLines={100}
              belongsTo={belongsTo}
              allowPhotoWithEmptyContent
            />
          </Animated.View>
        )}
        {!isScrollAtTop && Platform.OS === 'android' && (
          <BackToTopButton onPress={this.scrollToTop} style={styles.backToTop} />
        )}
        <BottomPopup
          // animateDuration={ANIMATE_DURATION}
          maskOpacity={0}
          ref={(ref) => {
            this.BottomPopup = ref;
          }}
        >
          <MoreMenu
            options={[
              {
                label: t('__more_menu_report'),
                onPress: this.onReportSubmit,
              },
              {
                label: t('__more_menu_hide'),
                onPress: this.onHidePost,
              },
              {
                label: t('__more_menu_cancel'),
                onPress: () => {
                  this.clearFocusedMoreItem();
                  this.BottomPopup.close();
                },
              },
            ]}
          />
        </BottomPopup>
      </AnimatedView>
    );
  }
}

export default connect(
  (state, props) => {
    const targetList = getStateKeyByBelongsTo(props.belongsTo);
    return {
      targetList,
      sceneKey: props.name,
      topic: state[targetList].topics.byId[props.topicId],
      posts: state[targetList].posts.allIds,
      postsById: state[targetList].posts.byId,
      routeName: state.appRoute.routeName,
      prevRoute: state.appRoute.prevRoute,
      circleName: state.circle.userCircle ? state.circle.userCircle.name : '',
      userCircle: state.circle.userCircle,
      homeCircle: state.circle.homeCircle,
      currentTimeZone: state.appState.currentTimeZone,
      isLoading: state.appState.isLoading,
      isInternetReachable: state.appState.currentNetworkInfo.isInternetReachable,
    };
  },
  (dispatch) =>
    bindActionCreators(
      {
        updatePost: PostActions.updatePost,
        resetPost: PostActions.resetPost,
        replaceTopics: TopicActions.replaceTopics,
        deleteTopicById: TopicActions.deleteTopicById,
        updateLoading: AppStateActions.onLoading,
        createPost: PostActions.createPost,
        fetchGetPost: PostActions.fetchGetPost,
        handleUpdateList: onUpdateList,
        fetchPostHidePost: ReportActions.hidePostById,
        updateTopicByKey: TopicActions.updateTopicByKey,
        updatePostCount: PostActions.updatePostCount,
        updatePostByKey: PostActions.updatePostByKey,
        showAlert: AppAlertActions.showAlert,
      },
      dispatch,
    ),
)(PostList);
