import React from "react";
import PropTypes from "prop-types";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import { Colors, Images } from "App/Theme";
import { translate as t } from "App/Helpers/I18n";
import Screen from "../utils/screen";

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    alignItems: "center",
    height: Screen.moderateScale(20),
  },
  toolBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: Screen.moderateScale(20),
  },
  toolBtnLabel: {
    fontSize: Screen.moderateScale(10),
    color: Colors.warmGrey,
    marginLeft: Screen.moderateScale(8),
  },
  toolBtnNumber: {
    marginLeft: Screen.moderateScale(5),
    fontSize: Screen.moderateScale(10),
    color: "black",
  },
  moreBtn: {
    position: "absolute",
    right: 0,
    padding: Screen.moderateScale(12),
  },
  peekModeDisabled: {
    opacity: 0.8,
  },
});

const CommentCardFooter = ({
  onShareBtnPress,
  onMoreBtnPress,
  onReplyPress,
  repliesLength,
  isPeekMode,
}) => (
  <View style={styles.footer}>
    <TouchableOpacity
      hitSlop={{
        top: 8,
        left: 8,
        bottom: 8,
        right: 8,
      }}
      style={[styles.toolBtn, isPeekMode && styles.peekModeDisabled]}
      onPress={onReplyPress}
      disabled={isPeekMode}
    >
      <Image source={Images.reply} />
      <Text style={styles.toolBtnLabel}>{t("__reply")}</Text>
      <Text style={styles.toolBtnNumber}>{repliesLength}</Text>
    </TouchableOpacity>
    <TouchableOpacity
      hitSlop={{
        top: 5,
        left: 5,
        bottom: 5,
        right: 5,
      }}
      style={[styles.toolBtn, isPeekMode && styles.peekModeDisabled]}
      onPress={onShareBtnPress}
      disabled={isPeekMode}
    >
      <Image source={Images.share} />
      <Text style={styles.toolBtnLabel}>{t("__share")}</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.moreBtn, isPeekMode && styles.peekModeDisabled]}
      onPress={onMoreBtnPress}
      disabled={isPeekMode}
    >
      <Image source={Images.more} />
    </TouchableOpacity>
  </View>
);

CommentCardFooter.propTypes = {
  onShareBtnPress: PropTypes.func.isRequired,
  onMoreBtnPress: PropTypes.func.isRequired,
  onReplyPress: PropTypes.func.isRequired,
  repliesLength: PropTypes.number.isRequired,
  isPeekMode: PropTypes.bool,
};

CommentCardFooter.defaultProps = {
  isPeekMode: false,
};

export default CommentCardFooter;
