import React from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty, debounce } from 'lodash';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Config from '~/Config';
import { Colors, Metrics } from '~/Theme';
import { Screen } from '~/Helper';
import { VoteActions } from '~/Stores';

import { getStateKeyByBelongsTo } from '~/Stores/List/Reducers';
import { DefaultText } from '../widget/Label';

const { BUTTON_DEBOUNCE } = Config;
const LIKE = 'LIKE';
const DISLIKE = 'DISLIKE';

const TargetType = {
  TOPIC: 'topics',
  POST: 'posts',
  REPLY: 'replies',
};

const styles = StyleSheet.create({
  container: {},
  likeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // marginBottom: Screen.scale(8),
    height: Screen.scale(24),
    borderRadius: Screen.scale(12),
    paddingHorizontal: Metrics.baseMargin / 2,
    backgroundColor: Colors.transparent,
    marginBottom: Metrics.baseMargin,
    // backgroundColor: 'red',
  },
  likeBtn: {
    width: Screen.scale(24),
    height: Screen.scale(24),
    borderRadius: Screen.scale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  likesLabel: {
    color: Colors.warmGrey,
    marginRight: Metrics.baseMargin / 2,
    paddingLeft: Screen.scale(10),
  },
  rightBlock: {
    flex: 1,
    justifyContent: 'space-around',
  },
});

class VoteBox extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['TOPIC', 'POST', 'REPLY']).isRequired,
    belongsTo: PropTypes.oneOf(['HERE_YOU_ARE', 'THERE_YOU_ARE', 'BROWSE', 'PEEK']).isRequired,
    disabled: PropTypes.bool,
    handleVote: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  likeOnPress = debounce(async () => {
    const { handleVote, belongsTo, type, id } = this.props;
    handleVote({
      contentType: type,
      voteType: LIKE,
      belongsTo,
      id,
    });
  }, BUTTON_DEBOUNCE);

  dislikeOnPress = debounce(async () => {
    const { handleVote, belongsTo, type, id } = this.props;
    handleVote({
      contentType: type,
      voteType: DISLIKE,
      belongsTo,
      id,
    });
  }, BUTTON_DEBOUNCE);

  getTargetList = () => {
    const targetList = this.props[TargetType[this.props.type]];
    return targetList;
  };

  render() {
    const targetList = this.getTargetList();
    if (isEmpty(targetList.byId[this.props.id])) {
      return <View />;
    }
    const voteData = targetList.byId[this.props.id].vote;
    const { disabled } = this.props;
    return (
      <View style={styles.rightBlock}>
        <TouchableOpacity
          disabled={disabled}
          hitSlop={{
            top: 20,
            left: 20,
            right: 20,
            bottom: 0,
          }}
          style={[
            styles.likeBox,
            voteData.current === LIKE && {
              backgroundColor: Colors.mainYellow,
            },
          ]}
          onPress={this.likeOnPress}
        >
          <DefaultText style={styles.likesLabel}>
            {numeral(voteData.like).format('0,0')}
          </DefaultText>
          <View style={[styles.likeBtn, { backgroundColor: Colors.mainYellow }]}>
            <MaterialIcon name="thumb-up-outline" size={Screen.scale(13)} color={Colors.black} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={disabled}
          style={[
            styles.likeBox,
            voteData.current === DISLIKE && {
              backgroundColor: Colors.silverThree,
            },
          ]}
          hitSlop={{
            top: 0,
            left: 20,
            right: 20,
            bottom: 20,
          }}
          onPress={this.dislikeOnPress}
        >
          <DefaultText style={styles.likesLabel}>
            {numeral(voteData.dislike).format('0,0')}
          </DefaultText>
          <View style={[styles.likeBtn, { backgroundColor: Colors.silverThree }]}>
            <MaterialIcon name="thumb-down-outline" size={Screen.scale(13)} color={Colors.black} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(
  (state, props) => {
    const targetListKey = getStateKeyByBelongsTo(props.belongsTo);
    return {
      ...state[targetListKey],
    };
  },
  (dispatch) => ({
    ...bindActionCreators(
      {
        handleVote: VoteActions.handleVote,
      },
      dispatch,
    ),
  }),
)(VoteBox);
