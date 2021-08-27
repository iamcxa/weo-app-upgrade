/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState';
import { createReducer } from 'reduxsauce';
import { FirebaseTypes } from './Actions';

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [FirebaseTypes.UPDATE_FIREBASE_STORE]: (state, action) => ({
    ...state,
    ...action.data,
  }),
});
