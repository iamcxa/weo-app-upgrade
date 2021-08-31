import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Alert } from 'react-native';

import { translate as t } from '~/Helpers/I18n';
import { BaseButton } from '~/Components';
import { Colors, Metrics, Fonts } from '~/Theme';
import { Screen, StyleSheet } from '~/Helper';
import { DefaultText } from '../widget/Label';
import VoteBox from './VoteBox';

export default class TopicCard extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    time: PropTypes.string,
    desc: PropTypes.string,
    likeNumber: PropTypes.number,
    disLikeNumber: PropTypes.number,
    onPress: PropTypes.func,
    likeOnPress: PropTypes.func,
    disLikeOnPress: PropTypes.func,
    replyCount: PropTypes.number.isRequired,
    belongsTo: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
    authorHash: PropTypes.string.isRequired,
    dark: PropTypes.bool,
  };

  static defaultProps = {
    title: '',
    time: '',
    desc: '',
    likeNumber: 0,
    disLikeNumber: 0,
    onPress: () => {},
    likeOnPress: () => {},
    disLikeOnPress: () => {},
    dark: false,
  };

  state = {};

  disableAlert = () => {
    Alert.alert('無法進行此動作', 'PEEK 模式下只能預覽，不能做任何動作');
  };

  render() {
    const { title, time, authorName, authorHash, replyCount, dark, onPress } = this.props;
    return (
      <BaseButton
        transparent
        style={styles.container}
        // onPress={dark ? this.disableAlert : this.onPress}
        onPress={onPress}
      >
        <View style={styles.leftBlock}>
          <DefaultText numberOfLines={2} style={[styles.title, dark && styles.dark]}>
            {title}
          </DefaultText>
          <View style={styles.timeRow}>
            <DefaultText style={styles.timeLabel}>
              {t('topic_list_reply_counts', {
                replyCount,
              })}
            </DefaultText>
            {/*
              <DefaultText style={[styles.timeLabel, { marginLeft: Screen.scale(11) }]}>
                {time}
              </DefaultText>
            */}
            <DefaultText
              style={[
                styles.timeLabel,
                {
                  marginLeft: Screen.scale(11),
                  width: Screen.scale(12 * 8),
                },
              ]}
              numberOfLines={1}
            >
              {`${authorName}`}
            </DefaultText>
          </View>
          {/* <DefaultText numberOfLines={2} style={styles.desc}>
            {desc}
          </DefaultText> */}
        </View>
        <View style={styles.rightBlock}>
          <VoteBox
            type="TOPIC"
            belongsTo={this.props.belongsTo}
            id={this.props.id}
            disabled={dark}
          />
        </View>
      </BaseButton>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Metrics.baseMargin * 2,
    height: '100%',
  },
  dark: {
    color: Colors.white,
    backgroundColor: Colors.blackFour,
  },
  leftBlock: {
    flex: 1,
  },
  rightBlock: {
    // width: 68
  },
  title: {
    fontSize: Fonts.size.regular,
    justifyContent: 'flex-start',
    fontWeight: 'bold',
    letterSpacing: 0,
    color: Colors.greyishBrown,
    marginVertical: Metrics.baseMargin / 4,
    minHeight: Metrics.baseMargin * 3,
    // marginVertical: Metrics.baseMargin,
  },
  timeLabel: {
    fontSize: Fonts.size.medium,
    fontWeight: '500',
    color: Colors.warmGrey,
    // marginBottom: Metrics.baseMargin,
    paddingLeft: Metrics.baseMargin / 4,
    // lineHeight: '24@sr',
    // lineHeight: parseInt(Screen.scale(17), 10)
  },
  timeRow: {
    flexDirection: 'row',
  },
});
