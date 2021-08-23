import { all, takeLatest } from 'redux-saga/effects';

import { ExampleTypes } from '~/Store/Example/Actions';

import * as Example from './ExampleSaga';

export default function* root() {
  yield all([
    /**
     * @see https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html
     */
    // Run the startup saga when the application starts
    // takeLatest(StartupTypes.STARTUP, startup),
    // Call `fetchUser()` when a `FETCH_USER` action is triggered
    takeLatest(ExampleTypes.FETCH_USER, Example.fetchUser),
    takeLatest(ExampleTypes.CREATE_POST, Example.createPost),
  ]);
}
