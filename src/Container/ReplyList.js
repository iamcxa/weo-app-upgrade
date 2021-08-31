import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  RefreshControl,
  View,
  FlatList,
  StyleSheet,
  Keyboard,
  Animated,
  Platform,
  AppState,
  Alert,
  SafeAreaView,
} from 'react-native';

import { Date as d, ListenableEvent } from '~/Helper';
import { translate as t } from '~/Helpers/I18n';
import { BackToTopButton, PostListFooter, MainNavBar, CommentCard, ReplyBar } from '~/Component';
import { Colors, Screen } from '~/Theme';
import { AppStateActions } from '~/Store';
import Config from '~/Config';

import {
  updateReply,
  resetReply,
  updateReplyByKey,
  deleteReplyById,
  createReply,
} from '~/Stores/List/Actions/reply';
import { updatePostByKey, deletePostById } from '~/Stores/List/Actions/post';
import { getStateKeyByBelongsTo } from '~/Stores/List/Reducers';
import { fetchAPI, apiHandler, apiAction } from '../utils/api';
import MoreMenu from '../widget/MoreMenu';
import BottomPopup from '../widget/BottomPopup';

const { REPLY_BAR_HEIGHT, ON_END_REACHED_THROTTLE } = Config;
const replyBarHeight = Screen.moderateScale(REPLY_BAR_HEIGHT);
const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 0,
  },
  flatList: {
    flex: 1,
    backgroundColor: Colors.paleGrey,
  },
  replyBar: {
    position: 'absolute',
    bottom: 0,
  },
  nav: {
    backgroundColor: 'white',
    paddingHorizontal: Screen.moderateScale(16),
  },
  listContent: {
    backgroundColor: Colors.paleGrey,
    minHeight: Screen.height - 70,
    paddingBottom: Screen.moderateScale(70),
  },
  listHeader: {
    marginHorizontal: Screen.moderateScale(28),
    marginLeft: Screen.moderateScale(29),
    borderLeftWidth: Screen.moderateScale(1),
    borderBottomWidth: Screen.moderateScale(1),
    borderColor: Colors.silver,
  },
  listItem: {
    marginHorizontal: Screen.moderateScale(28),
    marginLeft: Screen.moderateScale(50),
    borderLeftWidth: Screen.moderateScale(1),
    borderBottomWidth: Screen.moderateScale(1),
    borderColor: Colors.silver,
  },
  backToTop: {
    bottom: Screen.moderateScale(66),
  },
  highlightPostBorder: {
    borderWidth: 1,
    borderColor: Colors.mainYellow,
  },
});

@connect(
  (state, props) => {
    const targetListKey = getStateKeyByBelongsTo(props.belongsTo);
    return {
      userCircle: state.circle.userCircle,
      post: state[targetListKey].posts.byId[props.postId],
      replies: state[targetListKey].replies.allIds,
      repliesById: state[targetListKey].replies.byId,
      routeName: state.appRoute.routeName,
    };
  },
  (dispatch) =>
    bindActionCreators(
      {
        updateReply,
        resetReply,
        updateReplyByKey,
        deleteReplyById,
        deletePostById,
        updateLoading: AppStateActions.onLoading,
        createReply,
        updatePostByKey,
      },
      dispatch,
    ),
)
class ReplyList extends Component {
  static propTypes = {
    topic: PropTypes.object,
    replies: PropTypes.array.isRequired,
    repliesById: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    content: PropTypes.string,
    title: PropTypes.string,
    updateReply: PropTypes.func.isRequired,
    resetReply: PropTypes.func.isRequired,
    createReply: PropTypes.func.isRequired,
    updateReplyByKey: PropTypes.func.isRequired,
    updatePostByKey: PropTypes.func.isRequired,
    belongsTo: PropTypes.oneOf(['HERE_YOU_ARE', 'THERE_YOU_ARE']).isRequired,
    highlightHeader: PropTypes.bool,
    highlightReplyId: PropTypes.string,
  };

  static defaultProps = {
    highlightHeader: false,
    highlightReplyId: null,
    title: 'REPLY',
    post: {},
  };

  constructor(props) {
    super(props);
    this.keyboardHeight = new Animated.Value(0);
  }

  state = {
    refreshing: true,
    curPage: 0,
    isEnd: false,
    appState: AppState.currentState,
  };

  async componentDidMount() {
    this.resetReply();
    await this.getReplyList();
    if (this.props.replyId) {
      this.replyList.scrollToItem(this.props.replies[this.props.replyId]);
    }
    this.keyboardShowSub = Keyboard.addListener(ListenableEvent.KEYBOARD_SHOW, this.keyboardShow);
    this.keyboardHideSub = Keyboard.addListener(ListenableEvent.KEYBOARD_HIDE, this.keyboardHide);
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    this.keyboardShowSub && this.keyboardShowSub.remove();
    this.keyboardHideSub && this.keyboardHideSub.remove();
    AppState.removeEventListener('change', this.handleAppStateChange);
    // this.props.refreshPost();
  }

  onRefresh = () => {
    this.setState(
      {
        curPage: 0,
        isEnd: false,
      },
      () => {
        this.resetReply();
        this.getReplyList();
      },
    );
  };

  onReplySuccess = (res) => {
    if (this.state.curPage === res.data.paging.lastPage) {
      const data = {
        [res.data.id]: res.data,
      };
      this.setState({ newPostId: res.data.id });
      this.props.createReply({ target: this.props.belongsTo, data });
      this.props.updatePostByKey({
        target: this.props.belongsTo,
        data: {
          ...this.props.post,
          count: this.props.post.count + 1,
        },
        key: this.props.post.id,
      });
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
    if (curPage > 0) {
      await this.getReplyList();
    }
  }, ON_END_REACHED_THROTTLE);

  onHidePost = async () => {
    this.BottomPopup.close();
    this.props.updateLoading(true);
    const { type, id } = this.focusedMoreItem;
    const res = await fetchAPI(
      apiAction.HIDE_POST,
      {},
      {
        id,
      },
    );
    await apiHandler({
      res,
      done: () => {
        if (type === 'POST') {
          this.props.deletePostById({ target: this.props.belongsTo, id });
          Actions.pop();
        } else {
          // Reply
          this.props.deleteReplyById({ target: this.props.belongsTo, id });
        }
      },
      fail: () => {
        Alert.alert(t('__alert_request_failed_title'), t('__alert_request_failed_content'));
      },
    });
    this.props.updateLoading(false);
  };

  getReplyList = async (cb) => {
    try {
      const { curPage } = this.state;
      const res = await fetchAPI(
        apiAction.GET_POST_REPLIES,
        {
          curPage: curPage + 1,
        },
        {
          postId: this.props.postId,
        },
      );
      const perPageObj =
        this.props.replyId && this.props.replyId.length > 0 ? { perPage: 999999 } : {};
      await apiHandler({
        res,
        done: (_res) => {
          if (curPage + 1 <= _res.data.paging.lastPage) {
            const list = _res.data.items;
            const replies = _.keyBy(list, (obj) => obj.id);
            this.props.updateReply({
              target: this.props.belongsTo,
              data: replies,
            });
            const post = _res.data.parent;
            this.props.updatePostByKey({
              target: this.props.belongsTo,
              data: post,
              key: post.id,
            });
            this.setState(
              (prevState) => ({
                refreshing: false,
                isEnd: list.length === 0,
                curPage: prevState.curPage + 1,
                ...perPageObj,
              }),
              cb,
            );
          }
        },
        fail: () => {
          this.setState({
            refreshing: false,
          });
        },
      });
    } catch (error) {
      this.setState({ refreshing: false });
    }
  };

  handleAppStateChange = async (nextAppState) => {
    const { appState } = this.state;
    const { routeName } = this.props;
    if (
      appState.match(/inactive|background/) &&
      nextAppState === 'active' &&
      routeName === 'hereYouAre_replyList'
    ) {
      console.log('App has come to the foreground!');
      this.onRefresh();
    }
    this.setState({ appState: nextAppState });
  };

  resetReply = () => {
    this.props.resetReply({ target: this.props.belongsTo });
  };

  keyboardShow = (event) => {
    console.log('keyboard height: ', event.endCoordinates.height);
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

  formatData = (list) =>
    list.map((key) => {
      const data = this.props.repliesById[key];
      const time = d.humanize(data.createdAt);
      return {
        type: 'REPLY',
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
          if (this.replyBar.getWrappedInstance) {
            this.replyBar.getWrappedInstance().focus();
          }
        },
        onPress: () => {
          // Actions.commentList({
          //   postId: data.id,
          //   content: data.content,
          //   title: data.title,
          //   createdAt: moment(data.createdAt).format('YYYY/MM/DD HH:mm'),
          //   avatar: data.memberAvatar,
          //   authorName: data.memberName
          // });
        },
        onMoreBtnPress: () => {
          this.focusedMoreItem = {
            type: 'REPLY',
            id: data.id,
          };
          this.BottomPopup.open();
        },
      };
    });

  keyExtractor = (data) => data.id;

  scrollToTop = () => {
    if (this.replyList) {
      this.replyList.scrollToOffset({ x: 0, y: 0 });
    }
  };

  clearFocusedMoreItem = () => {
    this.focusedMoreItem = null;
  };

  renderItem = ({ item }) => (
    <CommentCard
      {...item}
      style={[
        styles.listItem,
        this.state.newPostId === item.id ? styles.highlightPostBorder : {},
        this.props.highlightReplyId === item.id ? styles.highlightPostBorder : {},
      ]}
      repliesLength={null}
      topic={this.props.topic}
    />
  );

  renderListHeader = () => (
    <View>
      <CommentCard
        id={this.props.postId}
        listHeader
        style={[styles.listHeader, this.props.highlightHeader ? styles.highlightPostBorder : {}]}
        type="POST"
        belongsTo={this.props.belongsTo}
        authorName={this.props.post.memberName}
        authorHash={this.props.post.memberHash}
        avatar={this.props.post.memberAvatar}
        {...this.props.post}
        createdAt={this.props.post.createdAt ? d.humanize(this.props.post.createdAt) : ''}
        onReplyPress={() => {
          if (this.replyBar.getWrappedInstance) {
            this.replyBar.getWrappedInstance().focus();
          }
        }}
        repliesLength={this.props.post.count}
        onMoreBtnPress={() => {
          this.focusedMoreItem = {
            type: 'POST',
            id: this.props.postId,
          };
          this.BottomPopup.open();
        }}
        topic={this.props.topic}
      />
    </View>
  );

  render() {
    return (
      <Animated.View style={[styles.container, { paddingBottom: this.keyboardHeight }]}>
        <MainNavBar title={this.props.title} style={styles.nav} />
        <FlatList
          ref={(ref) => {
            this.replyList = ref;
          }}
          data={this.formatData(this.props.replies)}
          keyExtractor={this.keyExtractor}
          ListHeaderComponent={this.renderListHeader}
          renderItem={this.renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.3}
          style={styles.flatList}
          ListFooterComponent={PostListFooter}
        />
        <Animated.View style={[styles.replyBar, { bottom: this.keyboardHeight }]}>
          <ReplyBar
            ref={(ref) => {
              this.replyBar = ref;
            }}
            type="REPLY"
            id={this.props.postId}
            disableUploadImage
            onReplySuccess={this.onReplySuccess}
          />
        </Animated.View>
        <BackToTopButton onPress={this.scrollToTop} style={styles.backToTop} />
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
                label: t('__more_menu_report'),
                onPress: this.onHidePost,
              },
              {
                label: t('__more_menu_report'),
                onPress: () => {
                  this.clearFocusedMoreItem();
                  this.BottomPopup.close();
                },
              },
            ]}
          />
        </BottomPopup>
      </Animated.View>
    );
  }
}

export default ReplyList;
