import React from 'react';
import PropTypes from 'prop-types';
import { Keyboard } from 'react-native';
import { has, isEmpty, isEqual, throttle } from 'lodash';
import { Actions } from 'react-native-router-flux';

import { AndroidBackKey } from 'App/Components';
// import { Dialog } from 'App/Helpers';
import { Config } from 'App/Config';
import TopicView from './TopicView';

const { ON_END_REACHED_THROTTLE, CIRCLE_TYPE } = Config;

let isListScrolling = false;
let isComponentMounted = false;

class TopicScreen extends React.Component {
  static propTypes = {
    sceneKey: PropTypes.string.isRequired,
    routeName: PropTypes.string.isRequired,
    prevRoute: PropTypes.string.isRequired,

    currentCircle: PropTypes.object,
    insideCircles: PropTypes.array,
    userCircle: PropTypes.object,
    homeCircle: PropTypes.object,
    leftCircleTime: PropTypes.any,
    hasGeolocationPermission: PropTypes.bool.isRequired,

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

  state = {
    curPage: 1,
    perPage: 100,
    circleId: null,
    sort: 'newest',
  };

  componentDidMount() {
    __DEV__ && console.log('@Enter TopicScreen');

    setTimeout(() => {
      this.handleRefreshCircleAndGetTopics();
    }, 1500);

    isComponentMounted = true;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { routeName, sceneKey } = this.props;
    if (sceneKey.includes(nextProps.routeName)) {
      isComponentMounted = true;
    } else {
      isComponentMounted = false;
    }
    return (
      !isListScrolling &&
      isComponentMounted &&
      // (nextProps.sceneKey.includes('voiceView') ||
      //   nextProps.sceneKey.includes('peekMapView') ||
      //   nextProps.sceneKey.includes(nextProps.routeName) ||
      //   sceneKey.includes(routeName)) &&
      (!isEqual(this.state, nextState) || !isEqual(this.props, nextProps))
    );
  }

  componentDidUpdate(prevProps) {
    const { userCircle, homeCircle, belongsTo, resetTopic, routeName, sceneKey } = this.props;
    if (prevProps.routeName !== routeName && routeName.includes(sceneKey)) {
      Keyboard.dismiss();
    }
    if (belongsTo === CIRCLE_TYPE.HERE_YOU_ARE) {
      if (prevProps.userCircle !== userCircle && userCircle && userCircle.id) {
        this.handleFetchTopics({
          belongsTo,
          circleId: userCircle.id,
          curPage: 1,
          sort: 'newest',
        });
      } else if (!userCircle || !userCircle.id) {
        resetTopic({ belongsTo });
      }
    } else if (belongsTo === CIRCLE_TYPE.THERE_YOU_ARE) {
      if (prevProps.homeCircle !== homeCircle && homeCircle && homeCircle.id) {
        resetTopic({ belongsTo });
        this.handleFetchTopics({
          belongsTo,
          circleId: homeCircle.id,
          curPage: 1,
          sort: 'newest',
        });
      }
    }
  }

  componentWillUnMount() {
    isComponentMounted = false;
  }

  handleSwitchCircle = (item) => {
    if (item.Value) {
      const { updateUserCircle } = this.props;
      updateUserCircle(item.rawCircleData);

      this.handleFetchTopics({
        circleId: item.Value,
        curPage: 1,
      });
    }
  };

  handleListReachEnd = throttle(() => {
    const { topicPaging, isFetching } = this.props;
    const { curPage, perPage, sort } = this.state;
    if (!isFetching && curPage > 0 && topicPaging.lastPage > curPage) {
      this.handleFetchTopics({
        sort,
        perPage,
        curPage: curPage + 1,
      });
    }
  }, ON_END_REACHED_THROTTLE);

  handleFetchTopics = (
    {
      sort = this.state.sort,
      curPage = this.state.curPage,
      perPage = this.state.perPage,
      circleId = this.state.circleId,
      belongsTo = this.props.belongsTo,
    } = this.state,
  ) => {
    const { fetchGetTopics, userCircle, homeCircle } = this.props;
    if (!circleId) {
      if (belongsTo === CIRCLE_TYPE.HERE_YOU_ARE && !isEmpty(userCircle)) {
        circleId = userCircle.id;
      }
      if (belongsTo === CIRCLE_TYPE.THERE_YOU_ARE && !isEmpty(homeCircle)) {
        circleId = homeCircle.id;
      }
    }
    if (circleId) {
      fetchGetTopics({
        sort,
        curPage,
        perPage,
        belongsTo,
        circleId,
      });
      this.setState({
        sort,
        curPage,
        circleId,
      });
    } else {
      this.setState({
        sort: 'newest',
        curPage: 1,
        perPage,
      });
    }
  };

  handleRefreshCircleAndGetTopics = (
    { sort = this.state.sort, curPage = this.state.curPage, perPage = this.state.perPage } = this
      .state,
  ) => {
    // console.log('sort, curPage, perPage=>', sort, curPage, perPage);
    const { fetchGetStayCircles, belongsTo, sceneKey } = this.props;

    if (belongsTo === CIRCLE_TYPE.HERE_YOU_ARE) {
      fetchGetStayCircles((geolocation) => {
        const { userCircle } = this.props;
        if (userCircle) {
          this.handleFetchTopics({
            sort,
            curPage,
            perPage,
          });
        }
      }, sceneKey);
    }
    if (belongsTo === CIRCLE_TYPE.THERE_YOU_ARE) {
      this.handleFetchTopics({
        sort,
        curPage,
        perPage,
      });
    }
  };

  render() {
    const {
      isFetching,
      topics,
      topicsById,
      currentCircle,
      insideCircles,
      userCircle,
      homeCircle,
      belongsTo,
      sceneKey,
      hasGeolocationPermission,
    } = this.props;
    const { sort, curPage } = this.state;
    return (
      <>
        <AndroidBackKey sceneKey={sceneKey} onBackKeyPress={Actions.voiceView} />
        <TopicView
          sort={sort}
          topics={topics}
          topicsById={topicsById}
          curPage={curPage}
          belongsTo={belongsTo}
          isLoading={isFetching}
          userCircle={userCircle}
          homeCircle={homeCircle}
          currentCircle={currentCircle}
          insideCircles={insideCircles}
          onEndReached={this.handleListReachEnd}
          hasGeolocationPermission={hasGeolocationPermission}
          onSwitchCircle={this.handleSwitchCircle}
          onRefresh={() =>
            this.handleRefreshCircleAndGetTopics({
              curPage: 1,
            })
          }
          onShowNewest={() =>
            this.handleFetchTopics({
              sort: 'newest',
              curPage: 1,
            })
          }
          onShowHottest={() =>
            this.handleFetchTopics({
              sort: 'hottest',
              curPage: 1,
            })
          }
          onScrollEndDrag={() => {
            isListScrolling = false;
          }}
          onScrollBeginDrag={() => {
            isListScrolling = true;
          }}
        />
      </>
    );
  }
}

export default TopicScreen;
