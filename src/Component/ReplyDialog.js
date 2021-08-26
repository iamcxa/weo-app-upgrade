import React from 'react';
import PropTypes from 'prop-types';
import rnTextSize from 'react-native-text-size';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { connect } from 'react-redux';
import { isString, isEmpty } from 'lodash';
import { bindActionCreators } from 'redux';
import { ScrollView, Text, View, StyleSheet, ActivityIndicator } from 'react-native';

import { Date as d, Screen } from 'App/Helpers';
import { PostActions } from 'App/Stores';
import { Fonts, Colors, Classes, Metrics } from 'App/Theme';

import { getStateKeyByBelongsTo } from 'App/Stores/List/Reducers';

import CommentCardHeader from './CommentCardHeader';
import CommentCardImage from './CommentCardImage';
// import VoteBox from './VoteBox';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.paleGrey,
    // height: 500,
    zIndex: 100,
  },
  title: {
    paddingTop: 4,
    paddingLeft: 16,
    paddingRight: 16,
  },
  emptyTitle: {
    marginTop: 32,
  },
  contentText: {
    ...Fonts.style.normal,
    margin: 8,
  },
});

class ReplyDialog extends React.PureComponent {
  static propTypes = {
    onTouchOutside: PropTypes.func.isRequired,
    belongsTo: PropTypes.string.isRequired,
    posts: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    replyPostId: PropTypes.string,
    children: PropTypes.any,
    fetchGetSinglePost: PropTypes.func.isRequired,
  };

  static defaultProps = {
    replyPostId: null,
    children: null,
  };

  state = {
    dialogHeight: 130,
    targetPost: {
      id: '',
      title: '',
      content: '',
      createdAt: '',
      memberName: '',
      memberAvatar: '',
    },
  };

  // async componentWillReceiveProps(nextProps) {
  //   const { replyPostId } = this.props;
  //   const { replyPostId: nextPostId, posts } = nextProps;

  //   if (replyPostId !== nextPostId) {
  //     this.setState({
  //       targetPost: null,
  //     });
  //     const targetPost = posts[nextPostId];
  //     if (targetPost) {
  //       this.setState({
  //         targetPost,
  //         dialogHeight: await this.getDialogHeight(),
  //       });
  //     } else {
  //       await this.handleGetPostDetail(nextPostId);
  //     }
  //   }
  // }

  async componentDidUpdate(prevProps) {
    const { visible, replyPostId, posts } = this.props;
    if (visible !== prevProps.visible && !visible) {
      this.setState({
        dialogHeight: 130,
      });
    }
    if (replyPostId !== prevProps.replyPostId) {
      this.setState({
        targetPost: null,
      });
      const targetPost = posts[replyPostId];
      if (targetPost) {
        this.setState({
          targetPost,
          dialogHeight: await this.getDialogHeight(targetPost.content),
        });
      } else {
        await this.handleGetPostDetail(replyPostId);
      }
    }
  }

  handleGetPostDetail = async (nextPostId) => {
    const { fetchGetSinglePost } = this.props;
    const getSuccess = async (res) => {
      this.setState({
        targetPost: res,
        dialogHeight: await this.getDialogHeight(res.content),
      });
    };
    fetchGetSinglePost(nextPostId, getSuccess);
  };

  getDialogHeight = async (content) => {
    if (isString(content)) {
      const size = await rnTextSize.measure({
        text: content.trim(), // text to measure, can include symbols
        width: Screen.width * 0.92, // max-width of the "virtual" container
        ...Fonts.style.normal,
        // ...fontSpecs, // RN font specification
      });
      return size.height + 130;
    }
    return 130;
  };

  getImageHeight = async (height) => {
    const { targetPost } = this.state;
    this.setState({
      dialogHeight: (await this.getDialogHeight(targetPost)) + height,
    });
  };

  render() {
    const { visible, onTouchOutside, belongsTo, children } = this.props;
    const { targetPost, dialogHeight } = this.state;
    return (
      <Dialog
        style={styles.wrapper}
        width={0.92}
        height={dialogHeight}
        visible={visible}
        onTouchOutside={onTouchOutside}
        dialogTitle={
          targetPost ? (
            <View style={styles.title}>
              {children &&
                children({
                  belongsTo,
                  id: targetPost.id,
                  type: 'POST',
                  avatar: targetPost.memberAvatar,
                  authorName: targetPost.memberName,
                  createdAt: d.humanize(targetPost.createdAt),
                  listHeader: false,
                })}
              <CommentCardHeader
                belongsTo={belongsTo}
                id={targetPost.id}
                type="POST"
                avatar={targetPost.memberAvatar}
                listHeader={false}
                authorName={targetPost.memberName}
                createdAt={d.humanize(targetPost.createdAt)}
              >
                {/* <VoteBox belongsTo={belongsTo} id={targetPost.id} type="POST" /> */}
              </CommentCardHeader>
            </View>
          ) : (
            <View style={styles.emptyTitle} />
          )
        }
      >
        <DialogContent style={Classes.fill}>
          {!isEmpty(targetPost) ? (
            <ScrollView style={Classes.fill}>
              <Text style={styles.contentText}>{targetPost.content}</Text>
              {typeof targetPost === 'object' &&
                targetPost.mediaUrl instanceof Array &&
                targetPost.mediaUrl.map((m, i) => (
                  <CommentCardImage
                    key={`image-${i}`}
                    mediaUrl={m.url}
                    getImageHeight={this.getImageHeight}
                  />
                ))}
            </ScrollView>
          ) : (
            <ActivityIndicator size="large" animating />
          )}
        </DialogContent>
      </Dialog>
    );
  }
}

export default connect(
  (state, props) => {
    const targetList = getStateKeyByBelongsTo(props.belongsTo);
    return {
      posts: state[targetList].posts,
    };
  },
  (dispatch) =>
    bindActionCreators(
      {
        fetchGetSinglePost: PostActions.fetchGetSinglePost,
      },
      dispatch,
    ),
)(ReplyDialog);
