/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */
import { pick } from "lodash";
import { createReducer } from "reduxsauce";

import { PostTypes } from "../Post/Actions";
import { TopicTypes } from "../Topic/Actions";
import { UserTypes } from "./Actions";
import { INITIAL_STATE } from "./InitialState";

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [TopicTypes.CREATE_TOPIC]: (state, action) => ({
    ...state,
    lastCreateTopicAt: new Date(),
  }),
  [PostTypes.CREATE_POST]: (state, action) => ({
    ...state,
    lastCreatePostAt: new Date(),
  }),
  [UserTypes.UPDATE_USER_STORE]: (state, action) => ({
    ...state,
    ...action.data,
  }),
  [UserTypes.UPDATE_USER_PROFILE]: (state, action) => ({
    ...state,
    apiToken: action.data.Authorization
      ? action.data.Authorization
      : state.apiToken,
    expiredAt: action.data.expiredAt ? action.data.expiredAt : state.expiredAt,
    expiredTime: action.data.expiredTime
      ? action.data.expiredTime
      : state.expiredAt,
    profile: {
      ...state.profile,
      ...action.data,
    },
    config: {
      ...state.config,
      ...pick(action.data, [
        "hasCircleNotify",
        "hasTopicNotify",
        "hasPostNotify",
        "hasReplyNotify",
      ]),
    },
  }),
  [UserTypes.UPDATE_USER_CONFIG]: (state, action) => ({
    ...state,
    config: {
      ...action.data,
    },
  }),
  [UserTypes.CLEAN_USER]: (state, action) => ({
    ...INITIAL_STATE,
  }),
  [UserTypes.UPDATE_TOOLTIP_VISIBILITY]: (state, action) => ({
    ...state,
    tooltip: {
      ...state.tooltip,
      [action.sceneKey]: {
        ...state.tooltip[action.sceneKey],
        [action.key]: action.value,
      },
    },
  }),
});
