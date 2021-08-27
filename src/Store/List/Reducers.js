import { combineReducers } from 'redux';
import topics from './topics';
import posts from './posts';
import replies from './replies';

const stateKey = {
  HERE_YOU_ARE: 'hereYouAre',
  THERE_YOU_ARE: 'thereYouAre',
  BROWSE: 'browse',
  PEEK: 'peek',
};

const initialState = {
  byId: {},
  allIds: [],
};

export const dataInitialState = {
  topics: initialState,
  posts: initialState,
  replies: initialState,
};

export const subReducer = combineReducers({
  topics,
  posts,
  replies,
});

const listReducer = (keyOfBelongsTo) => (state = dataInitialState, action) => {
  if (action.target === keyOfBelongsTo) {
    return {
      ...state,
      ...subReducer(state, action),
    };
  }
  return state;
};

export const getStateKeyByBelongsTo = (belongsTo) => stateKey[belongsTo];

export default listReducer;
