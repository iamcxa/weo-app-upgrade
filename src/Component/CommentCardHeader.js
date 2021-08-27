import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import Colors from "App/Theme/Colors";
import Screen from "../utils/screen";

const topicListHeaderStyles = StyleSheet.create({
  avatar: {
    borderColor: Colors.lightGrey,
  },
});

const postListHeaderStyles = StyleSheet.create({
  container: {
    paddingHorizontal: Screen.moderateScale(16),
    paddingBottom: Screen.moderateScale(14),
    borderLeftWidth: Screen.moderateScale(1),
  },
});

const replyListItemHeaderStyles = StyleSheet.create({
  container: {
    paddingHorizontal: Screen.moderateScale(16),
    paddingBottom: Screen.moderateScale(14),
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
    height: Screen.moderateScale(61),
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: Screen.moderateScale(48),
    height: Screen.moderateScale(48),
  },
  avatar: {
    // resizeMode: 'cover',
    width: Screen.moderateScale(48),
    height: Screen.moderateScale(48),
    borderRadius: Screen.moderateScale(24),
    borderWidth: Screen.moderateScale(5),
  },
  author: {
    flex: 1,
    marginLeft: Screen.moderateScale(6),
  },
  authorName: {
    fontSize: Screen.moderateScale(12),
    color: Colors.blackTwo,
    marginBottom: Screen.moderateScale(1),
  },
  peekModeAuthorName: {
    color: Colors.white,
  },
  timeLabel: {
    fontSize: Screen.moderateScale(12),
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
