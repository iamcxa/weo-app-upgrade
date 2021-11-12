/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { createReducer } from "reduxsauce";

import { TooltipTypes } from "./Actions";
import { INITIAL_STATE } from "./InitialState";

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [TooltipTypes.UPDATE_TOOLTIPS]: (state, action) => ({
    ...state,
    ...action.data,
  }),
});
