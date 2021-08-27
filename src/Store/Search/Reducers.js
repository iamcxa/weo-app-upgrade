/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState';
import { createReducer } from 'reduxsauce';
import { SearchTypes } from './Actions';

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [SearchTypes.UPDATE_SEARCH_STORE]: (state, action) => ({
    ...state,
    ...action.data,
  }),

  [SearchTypes.FETCH_GET_POPULAR_KEYWORDS]: (state, action) => ({
    ...state,
    poplarKeyWords: [],
  }),

  [SearchTypes.FETCH_GET_SEARCH_RESULT]: (state, action) => ({
    ...state,
    searchResult: [],
    paging: {},
  }),
});
