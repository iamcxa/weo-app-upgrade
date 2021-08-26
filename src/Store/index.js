import { combineReducers } from 'redux';

import configureStore from '../CreateStore';
import rootSaga from '../Saga';
import reducers from './Reducers';

/**
 * Export default reducers
 *
 * @returns {object} store object
 */
const createStore = () => {
  const rootReducer = combineReducers(reducers);
  return configureStore(rootReducer, rootSaga);
};

export const { store: AppStore, persistor } = createStore();
