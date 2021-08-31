import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { CircleActions, TopicActions, AppPermissionSelectors } from '~/Store';
import { getStateKeyByBelongsTo } from '~/Stores/List/Reducers';
import { Permission } from '~/Helper';
import { Config } from '~/Config';

import TopicScreen from './TopicScreen';

const { CIRCLE_TYPE } = Config;

class ThereYouAreTopicScreen extends React.Component {
  static propTypes = {
    sceneKey: PropTypes.string.isRequired,
    routeName: PropTypes.string.isRequired,
    prevRoute: PropTypes.string.isRequired,

    currentCircle: PropTypes.object,
    insideCircles: PropTypes.array,
    userCircle: PropTypes.object,
    homeCircle: PropTypes.object,
    leftCircleTime: PropTypes.any,

    resetTopic: PropTypes.func.isRequired,
    fetchGetTopics: PropTypes.func.isRequired,
    fetchGetStayCircles: PropTypes.func.isRequired,
    updateUserCircle: PropTypes.func.isRequired,

    belongsTo: PropTypes.oneOf([...Object.keys(CIRCLE_TYPE)]).isRequired,
    topics: PropTypes.array.isRequired,
    topicsById: PropTypes.object.isRequired,
    topicPaging: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    homeCircle: {},
    currentCircle: {},
    insideCircles: [],
    userCircle: {},
    leftCircleTime: null,
  };

  render() {
    return <TopicScreen {...this.props} />;
  }
}

export default connect(
  (state, props) => {
    const targetName = getStateKeyByBelongsTo(props.belongsTo);
    return {
      // belongsTo: CIRCLE_TYPE.HERE_YOU_ARE,
      topics: state[targetName].topics.allIds,
      topicsById: state[targetName].topics.byId,
      topicPaging: state[targetName].topics.paging,
      isFetching: state[targetName].topics.isFetching,

      sceneKey: props.name,
      routeName: state.appRoute.routeName,
      prevRoute: state.appRoute.prevRoute,

      leftCircleTime: state.circle.leftCircleTime,
      insideCircles: state.circle.insideCircles,
      currentCircle: state.circle.currentCircle,
      userCircle: state.circle.userCircle,
      homeCircle: state.circle.homeCircle,
      hasGeolocationPermission:
        AppPermissionSelectors.hasThisPermission(Permission.GEOLOCATION_LOW)(state) ||
        AppPermissionSelectors.hasThisPermission(Permission.GEOLOCATION_HIGH)(state),
    };
  },
  (dispatch) =>
    bindActionCreators(
      {
        updateUserCircle: CircleActions.updateUserCircle,
        fetchGetStayCircles: CircleActions.fetchGetStayCircles,
        fetchGetTopics: TopicActions.fetchGetThereYouAreTopics,
        resetTopic: TopicActions.resetTopic,
      },
      dispatch,
    ),
)(ThereYouAreTopicScreen);
