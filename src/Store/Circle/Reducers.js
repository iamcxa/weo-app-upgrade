/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { isEmpty, uniqBy } from "lodash";
import { createReducer } from "reduxsauce";

import { CircleTypes } from "./Actions";
import { INITIAL_STATE } from "./InitialState";

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [CircleTypes.UPDATE_CIRCLE_STORE]: (state, action) => ({
    ...state,
    ...action.data,
  }),

  [CircleTypes.UPDATE_LEFT_APP_TIME]: (state, action) => ({
    ...state,
    leftAppTime: action.data,
  }),

  [CircleTypes.UPDATE_LEFT_CIRCLE_TIME]: (state, action) => ({
    ...state,
    leftCircleTime: action.data,
    prevUserCircle: state.userCircle ? state.userCircle : {},
  }),

  [CircleTypes.UPDATE_USER_CIRCLE]: (state, action) => ({
    ...state,
    userCircle: action.data ? action.data : state.currentCircle,
  }),

  [CircleTypes.UPDATE_WHEN_ENTER_CIRCLE]: (state, { circle }) => ({
    ...state,
    insideCircles: uniqBy([circle, ...state.insideCircles], "id"),
    currentCircle: circle,
  }),

  [CircleTypes.UPDATE_WHEN_EXIT_CIRCLE]: (state, { circle }) => ({
    ...state,
    insideCircles: state.insideCircles.filter((e) => e.id !== circle.id),
    currentCircle: isEmpty(state.insideCircles) ? null : state.insideCircles[0],
  }),

  [CircleTypes.UPDATE_HOME_CIRCLE]: (state, action) => ({
    ...state,
    homeCircle: action.data ? action.data : state.currentCircle,
  }),

  [CircleTypes.UPDATE_CIRCLES]: (state, action) => {
    const {
      currentCircle = {},
      insideCircles = [],
      nearCircles = [],
      userCircle = null,
    } = action.data;
    const newData = {
      ...state,
      currentCircle,
      insideCircles,
      nearCircles,
    };
    if (!state.userCircle) {
      newData.userCircle = userCircle || currentCircle;
    }
    return newData;
  },
});
