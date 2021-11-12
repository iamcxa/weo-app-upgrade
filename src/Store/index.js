import createStore from "../CreateStore";

/**
 * Export default reducers
 *
 * @returns {object} store object
 */

export const { store: AppStore, persistor, sagaMiddleware } = createStore();
