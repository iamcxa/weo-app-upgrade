import { combineReducers } from 'redux';
import rootSaga from '../Saga';
import reducers from './Reducers';
import configureStore from './CreateStore';

/**
 * Export default reducers
 */
const createStore = () => {
  const rootReducer = combineReducers(reducers);
  return configureStore(rootReducer, rootSaga);
};

export const { store: AppStore, persistor } = createStore();
