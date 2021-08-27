/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { ActionConst, Actions } from 'react-native-router-flux';
import { createReducer, Types as ReduxSauceTypes } from 'reduxsauce';

import { INITIAL_STATE } from './InitialState';
import { getRoutePrefix } from './Helpers';

const handleRoutePop = (state, action) => {
  state.stack.pop();
  return {
    ...state,
    ...action,
  };
};

const handleRoutePush = (state, action) => {
  return {
    ...state,
    ...action,
    stack: [...state.stack, action.routeName],
  };
};

export const reducer = createReducer(INITIAL_STATE, {
  [ReduxSauceTypes.DEFAULT]: (state, action) => ({
    ...state,
    prevRoute: getRoutePrefix(Actions.prevScene),
    routeName: getRoutePrefix(action.routeName),
  }),
  [ActionConst.FOCUS]: (state, action) => ({
    ...state,
    ...action,
    routeName: getRoutePrefix(action.routeName),
    scene: {
      sceneKey: getRoutePrefix(action.routeName),
      drawer: 'DrawerClose',
    },
  }),
  'Navigation/BACK': handleRoutePop,
  'Navigation/PUSH': handleRoutePush,
});
