import React from 'react';
import PropTypes from 'prop-types';
import { throttle, isEqual } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { Config } from 'App/Config';
import { TopicActions } from 'App/Stores';
import { getStateKeyByBelongsTo } from 'App/Stores/List/Reducers';
import PeekTopicView from './PeekTopicView';

const { ON_END_REACHED_THROTTLE, CIRCLE_TYPE } = Config;

let isComponentMounted = false;

class PeekTopicScreen extends React.Component {
  static propTypes = {
    sceneKey: PropTypes.string.isRequired,
    routeName: PropTypes.string.isRequired,
    prevRoute: PropTypes.string.isRequired,

    belongsTo: PropTypes.oneOf([...Object.keys(CIRCLE_TYPE)]).isRequired,
    topics: PropTypes.object.isRequired,
    topicPaging: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,

    circleList: PropTypes.array.isRequired,

    resetTopic: PropTypes.func.isRequired,
    fetchGetTopics: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  state = {
    curPage: 1,
    perPage: 15,
    sort: 'newest',
    activeSlide: 0,
    belongsTo: this.props.belongsTo,
  };

  componentDidMount() {
    __DEV__ && console.log('@Enter PeekTopicScreen');
    const { circleList } = this.props;

    setTimeout(() => {
      if (circleList[0] && circleList[0].id) {
        this.handleFetchTopics({
          curPage: 1,
          sort: 'newest',
        });
      }
    }, 500);

    isComponentMounted = true;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { sceneKey } = this.props;
    const { isCarouselLoaded, activeSlide } = this.state;
    if (sceneKey.includes(nextProps.routeName)) {
      isComponentMounted = true;
    } else {
      isComponentMounted = false;
    }
    if (!isComponentMounted || nextProps.sceneKey !== Actions.currentScene) {
      return false;
    }
    if (
      // isFetching !== nextProps.isFetching ||
      activeSlide !== nextState.activeSlide ||
      isCarouselLoaded !== nextState.isCarouselLoaded
    ) {
      return true;
    }
    return !isEqual(this.state, nextState) || !isEqual(this.props, nextProps);
  }

  componentWillUnmount() {
    isComponentMounted = false;
  }

  handleListReachEnd = throttle(() => {
    const { topicPaging, isFetching } = this.props;
    const { curPage, perPage, sort } = this.state;
    if (!isFetching && curPage > 0 && topicPaging.lastPage > curPage) {
      // console.log('fire handleFetchTopics');
      this.handleFetchTopics({
        sort,
        perPage,
        curPage: curPage + 1,
      });
    }
  }, ON_END_REACHED_THROTTLE);

  handleFetchTopics = (
    {
      activeSlide = this.state.activeSlide,
      sort = this.state.sort,
      curPage = this.state.curPage,
      perPage = this.state.perPage,
    } = this.state,
  ) => {
    const { fetchGetTopics, circleList, belongsTo, isFetching } = this.props;
    const circle = circleList[activeSlide];
    // console.log('circle=>', circle);
    if (!isFetching) {
      if (circle && circle.id) {
        fetchGetTopics({
          sort,
          curPage,
          perPage,
          belongsTo,
          circleId: circle.id,
        });
        this.setState({
          sort,
          curPage,
        });
      } else {
        this.setState({
          sort: 'newest',
          curPage: 1,
          perPage,
        });
      }
    }
  };

  handleSnapItemChange = (index) => {
    this.setState(
      (state) => ({ ...state, activeSlide: index }),
      () => {
        this.handleFetchTopics({
          activeSlide: index,
          sort: 'newest',
          curPage: 1,
        });
      },
    );
  };

  handleBeforeSnapItemChange = () => {
    const { resetTopic, belongsTo } = this.props;
    resetTopic({ belongsTo });
  };

  render() {
    const { isFetching, topics, circleList, belongsTo } = this.props;
    const { sort, activeSlide } = this.state;
    // console.log('insideCircles=>', insideCircles);
    return (
      <PeekTopicView
        {...this.props}
        topics={topics}
        circleList={circleList}
        sort={sort}
        activeSlide={activeSlide}
        belongsTo={belongsTo}
        isFetching={isFetching}
        handleSnapItemChange={this.handleSnapItemChange}
        handleBeforeSnapItemChange={this.handleBeforeSnapItemChange}
        handleFetchTopics={this.handleFetchTopics}
        handleListReachEnd={this.handleListReachEnd}
        handleShowNewest={() =>
          this.handleFetchTopics({
            sort: 'newest',
            curPage: 1,
          })
        }
        handleShowHottest={() =>
          this.handleFetchTopics({
            sort: 'hottest',
            curPage: 1,
          })
        }
      />
    );
  }
}

export default connect(
  (state, props) => {
    const targetName = getStateKeyByBelongsTo(props.belongsTo);
    return {
      sceneKey: props.name,
      routeName: state.appRoute.routeName,
      prevRoute: state.appRoute.prevRoute,

      topics: state[targetName].topics.byId,
      topicPaging: state[targetName].topics.paging,
      isFetching: state[targetName].topics.isFetching,
    };
  },
  (dispatch) =>
    bindActionCreators(
      {
        fetchGetTopics: TopicActions.fetchGetTopics,
        resetTopic: TopicActions.resetTopic,
      },
      dispatch,
    ),
)(PeekTopicScreen);
