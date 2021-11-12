/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { createReducer } from "reduxsauce";

import { AppApiTypes } from "./Actions";
import { INITIAL_STATE } from "./InitialState";

export const onApiFetching = (state, { config, method, url, options }) => ({
  ...state,
  request: config,
  response: null,
  error: null,
  isFetching: true,
});

export const onApiFetchSuccess = (state, { data }) => ({
  ...state,
  response: data,
  error: null,
  isFetching: false,
});

export const onApiFetchFailure = (state, { error }) => ({
  ...state,
  error,
  response: null,
  isFetching: false,
});

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [AppApiTypes.ON_API_FETCHING]: onApiFetching,
  [AppApiTypes.ON_API_FETCH_SUCCESS]: onApiFetchSuccess,
  [AppApiTypes.ON_API_FETCH_FAILURE]: onApiFetchFailure,
});
