import React, { Component } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { Date as d } from "App/Helpers";
import { Colors, Metrics, Fonts } from "App/Theme";
import { H3, H5 } from "../widget/Label.js";

export default class NotifyCard extends Component {
  render() {
    const { isRead, title, time, desc } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.container,
          isRead
            ? { backgroundColor: Colors.paleGrey50 }
            : { backgroundColor: Colors.white },
        ]}
        {...this.props}
      >
        <H3 style={[styles.titleLabel, isRead && styles.read]}>
          {!isRead && <Text style={styles.yellowBadge}>●</Text>}
          {title}
        </H3>
        <Text style={[styles.timeLabel, , isRead && styles.read]}>
          {d.humanize(time)}
          {__DEV__ && `(${d.formatDate(time, "YYYY-MM-DD HH:mm")})`}
        </Text>
        <H5
          style={[styles.descLabel, isRead && styles.read]}
          ellipsizeMode="tail"
          numberOfLines={3}
        >
          {desc}
        </H5>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.baseMargin * 4,
    paddingVertical: Metrics.baseMargin * 2,
    justifyContent: "center",
    flex: 1,
  },
  titleLabel: {
    fontWeight: "bold",
  },
  timeLabel: {
    marginVertical: Metrics.baseMargin,
    color: Colors.warmGrey,
  },
  descLabel: {
    color: Colors.greyishBrownTwo,
  },
  read: {
    // color: Colors.warmGrey,
    opacity: 0.4,
  },
  yellowBadge: {
    color: Colors.mainYellow,
  },
});
