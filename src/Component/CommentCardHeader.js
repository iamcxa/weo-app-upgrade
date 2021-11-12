import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import Colors from "~/Theme/Colors";
import { Screen } from "~/Helper";

const topicListHeaderStyles = StyleSheet.create({
  avatar: {
    borderColor: Colors.lightGrey,
  },
});

const postListHeaderStyles = StyleSheet.create({
  container: {
    paddingHorizontal: Screen.scale(16),
    paddingBottom: Screen.scale(14),
    borderLeftWidth: Screen.scale(1),
  },
});

const replyListItemHeaderStyles = StyleSheet.create({
  container: {
    paddingHorizontal: Screen.scale(16),
    paddingBottom: Screen.scale(14),
  },
});

const listItemStyles = StyleSheet.create({
  avatar: {
    borderColor: Colors.silverFour,
  },
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    height: Screen.scale(61),
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: Screen.scale(48),
    height: Screen.scale(48),
  },
  avatar: {
    // resizeMode: 'cover',
    width: Screen.scale(48),
    height: Screen.scale(48),
    borderRadius: Screen.scale(24),
    borderWidth: Screen.scale(5),
  },
  author: {
    flex: 1,
    marginLeft: Screen.scale(6),
  },
  authorName: {
    fontSize: Screen.scale(12),
    color: Colors.blackTwo,
    marginBottom: Screen.scale(1),
  },
  peekModeAuthorName: {
    color: Colors.white,
  },
  timeLabel: {
    fontSize: Screen.scale(12),
    color: Colors.warmGrey,
  },
  voteBlock: {},
});

export default class CommentCardHeader extends Component {
  static propTypes = {
    children: PropTypes.object,
    isPeekMode: PropTypes.bool,
    avatar: PropTypes.string,
    authorName: PropTypes.string,
    createdAt: PropTypes.string,
    type: PropTypes.string,
    listHeader: PropTypes.bool,
  };

  static defaultProps = {
    isPeekMode: false,
    children: undefined,
    avatar: "",
    authorName: "",
    createdAt: "",
    type: "",
    listHeader: false,
  };

  state = {};

  getSpecificStyle = (key) => [
    styles[key],
    this.props.type === "TOPIC" && this.props.listHeader
      ? topicListHeaderStyles[key]
      : listItemStyles[key],
    this.props.type === "POST" &&
      this.props.listHeader &&
      postListHeaderStyles[key],
    this.props.type === "REPLY" &&
      !this.props.listHeader &&
      replyListItemHeaderStyles[key],
  ];

  render() {
    const { children, isPeekMode, avatar, authorName, createdAt } = this.props;
    return (
      <View style={styles.header}>
        <View style={[styles.avatarContainer, this.getSpecificStyle("avatar")]}>
          {!!avatar && (
            <Image
              style={this.getSpecificStyle("avatar")}
              source={{ uri: avatar }}
            />
          )}
        </View>
        <View style={styles.author}>
          <Text
            style={[styles.authorName, isPeekMode && styles.peekModeAuthorName]}
          >
            {authorName}
          </Text>
          <Text style={styles.timeLabel}>{createdAt}</Text>
        </View>
        <View style={styles.voteBlock}>
          {typeof children === "object" && children}
        </View>
      </View>
    );
  }
}
