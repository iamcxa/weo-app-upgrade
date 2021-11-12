import React from "react";
import { createSelectorHook, Provider } from "react-redux";

import createStore from "./CreateStore";

export { default as ApiActions } from "./AppApi/Actions";

/**
 * Export default reducers
 *
 * @returns {object} store object
 */

export const { store: ApiStore, sagaMiddleware } = createStore();

export const ApiProvider = () => <Provider store={ApiStore} />;

export const context = React.createContext(null);

/**
 * A hook to access the ApiHandler store's state. This hook takes a selector function
 * as an argument. The selector is called with the store state.
 *
 * @param {Function} selector the selector function
 * @param {Function=} equalityFn the function that will be used to determine equality
 *
 * @returns {any} the selected state
 *
 * @example
 *
 * import React from 'react'
 * import { useSelector } from 'react-redux'
 *
 * export const CounterComponent = () => {
 *   const counter = useSelector(state => state.counter)
 *   return <div>{counter}</div>
 * }
 */
export const useSelector = createSelectorHook(context);

export default {
  ApiProvider,
  ApiStore,
  sagaMiddleware,
};
