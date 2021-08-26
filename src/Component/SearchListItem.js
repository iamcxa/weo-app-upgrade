import React from 'react';
import PropTypes from 'prop-types';
import Highlighter from 'react-native-highlight-words';
import { Actions } from 'react-native-router-flux';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

import { Date as d, Screen } from 'App/Helpers';
import { Colors } from 'App/Theme';
import { getStateKeyByBelongsTo } from 'App/Stores/List/Reducers';

const styles = StyleSheet.create({
  container: {
    paddingVertical: Screen.scale(14),
    borderBottomWidth: Screen.scale(1),
    borderColor: Colors.silverTwo,
  },
  topic: {},
  topicTitle: {
    fontSize: Screen.scale(16),
    fontWeight: '500',
    lineHeight: parseInt(Screen.scale(20), 10),
    color: Colors.greyishBrown,
  },
  detailBar: {
    flexDirection: 'row',
    marginTop: Screen.scale(5),
  },
  topicCreatedAt: {
    fontSize: Screen.scale(12),
    color: Colors.warmGrey,
    marginRight: Screen.scale(13),
  },
  topicAuthor: {
    fontSize: Screen.scale(12),
    color: Colors.warmGrey,
  },
  topicContent: {
    marginTop: Screen.scale(5),
    fontSize: Screen.scale(12),
    color: Colors.warmGrey,
  },
  post: {
    marginLeft: Screen.scale(34),
    marginTop: Screen.scale(8),
    paddingTop: Screen.scale(8),
    borderTopWidth: Screen.scale(1),
    borderColor: Colors.silverTwo,
  },
  postContent: {
    fontSize: Screen.scale(12),
    color: Colors.warmGrey,
  },
  reply: {
    marginLeft: Screen.scale(29),
    marginTop: Screen.scale(8),
    paddingTop: Screen.scale(8),
    borderTopWidth: Screen.scale(1),
    borderColor: Colors.silverTwo,
  },
  replyContent: {
    fontSize: Screen.scale(12),
    color: Colors.warmGrey,
  },
  highlightStyle: {
    backgroundColor: Colors.lightBeige,
  },
});

export default class SearchListItem extends React.PureComponent {
  static propTypes = {
    itemData: PropTypes.object.isRequired,
    belongsTo: PropTypes.string.isRequired,
    searchWords: PropTypes.array.isRequired,
  };

  static defaultProps = {};

  state = {};

  onTopicPress = () => {
    const key = getStateKeyByBelongsTo(this.props.belongsTo);
    const {
      id,
      content,
      memberName,
      memberHash,
      memberAvatar,
      createdAt,
      title,
    } = this.props.itemData;
    // Actions.pop();
    console.log('key=>', key);
    console.log('this.props.itemData=>', this.props.itemData);
    Actions[`${key}_postList`]({
      // Actions.privacy({
      // type: 'popTo',
      title,
      topicId: id,
      content,
      authorName: memberName,
      authorHash: memberHash,
      avatar: memberAvatar,
      createdAt,
      topic: {
        title: this.props.itemData.title,
      },
      highlightHeader: true,
      belongsTo: this.props.belongsTo,
    });
  };

  onPostPress = (post) => {
    const key = getStateKeyByBelongsTo(this.props.belongsTo);
    const {
      id,
      content,
      memberName,
      memberHash,
      memberAvatar,
      createdAt,
      title,
    } = this.props.itemData;
    const {
      id: postId,
      content: postContent,
      // memberName,
      // memberHash,
      // memberAvatar,
      // createdAt,
      // topicId,
    } = post;
    console.log('post=>', post);
    // Actions[`${key}_replyList`]({
    // Actions.privacy({
    // Actions.postList({
    Actions[`${key}_postList`]({
      type: 'push',
      title: this.props.itemData.title,
      postId,
      topicId: id,
      content,
      authorName: memberName,
      authorHash: memberHash,
      avatar: memberAvatar,
      createdAt,
      // topic: {
      //   title: this.props.itemData.title,
      // },
      // topic: {
      //   title: this.props.itemData.title,
      // },
      highlightHeader: false,
      belongsTo: this.props.belongsTo,
    });
  };

  onReplyPress = (post, reply) => {
    const key = getStateKeyByBelongsTo(this.props.belongsTo);
    const {
      id,
      content,
      memberName,
      memberHash,
      memberAvatar,
      createdAt,
      topicId,
    } = reply;
    // Actions.postList({

    console.log('reply=>', reply);
    Actions[`${key}_postList`]({
      // Actions[`${key}_replyList`]({
      title: this.props.itemData.title,
      topicId: topicId,
      postId: post.id,
      replyId: id,
      content,
      authorName: memberName,
      authorHash: memberHash,
      avatar: memberAvatar,
      createdAt,
      topic: {
        title: this.props.itemData.title,
      },
      highlightReplyId: id,
      belongsTo: this.props.belongsTo,
    });
  };

  render() {
    const { itemData } = this.props;
    return (
      <View {...this.props} style={styles.container}>
        <TouchableOpacity style={styles.topic} onPress={this.onTopicPress}>
          <Highlighter
            style={styles.topicTitle}
            numberOfLines={2}
            highlightStyle={styles.highlightStyle}
            searchWords={this.props.searchWords}
            textToHighlight={itemData.title}
          />
          <View style={styles.detailBar}>
            {/*
              <Text style={styles.topicCreatedAt} numberOfLines={1}>
                {humanize(itemData.createdAt)}
              </Text>
            */}
            <Text style={styles.topicAuthor} numberOfLines={1}>
              {`${itemData.memberName}#${itemData.memberHash}`}
            </Text>
          </View>
          {itemData.content && (
            <Highlighter
              style={styles.topicContent}
              numberOfLines={3}
              highlightStyle={styles.highlightStyle}
              searchWords={this.props.searchWords}
              textToHighlight={itemData.content}
            />
          )}
          {itemData.posts &&
            itemData.posts.length > 0 &&
            itemData.posts.map((post) => (
              <TouchableOpacity
                style={styles.post}
                key={post.id}
                onPress={() => {
                  this.onPostPress(post);
                }}
              >
                <Highlighter
                  style={styles.postContent}
                  numberOfLines={3}
                  highlightStyle={styles.highlightStyle}
                  searchWords={this.props.searchWords}
                  textToHighlight={post.content}
                />
                {post.replies.length > 0 &&
                  post.replies.map((reply) => (
                    <TouchableOpacity
                      style={styles.reply}
                      key={reply.id}
                      onPress={() => {
                        this.onReplyPress(post, reply);
                      }}
                    >
                      <Highlighter
                        style={styles.replyContent}
                        numberOfLines={3}
                        highlightStyle={styles.highlightStyle}
                        searchWords={this.props.searchWords}
                        textToHighlight={reply.content}
                      />
                    </TouchableOpacity>
                  ))}
              </TouchableOpacity>
            ))}
        </TouchableOpacity>
      </View>
    );
  }
}
