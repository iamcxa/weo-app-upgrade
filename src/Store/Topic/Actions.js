import { createActions } from 'reduxsauce';

/**
 * We use reduxsauce's `createActions()` helper to easily create redux actions.
 *
 * Keys are action names and values are the list of parameters for the given action.
 *
 * Action names are turned to SNAKE_CASE into the `Types` variable. This can be used
 * to listen to actions:
 *
 * - to trigger reducers to update the state, for example in App/Stores/Example/Reducers.js
 * - to trigger sagas, for example in App/Sagas/index.js
 *
 * Actions can be dispatched:
 *
 * - in React components using `dispatch(...)`, for example in @App/App.js
 * - in sagas using `yield put(...)`, for example in App/Sagas/ExampleSaga.js
 *
 * @see https://github.com/infinitered/reduxsauce#createactions
 */
const { Types, Creators } = createActions({
  updateTopicStore: ['data'],

  updateHereTopics: ['data'],
  cleanHereTopics: null,

  updateThereTopics: ['data'],
  cleanThereTopics: null,

  fetchGetTopics: {
    sort: 'newest',
    curPage: 1,
    perPage: 100,
    circleId: null,
    belongsTo: null,
  },
  fetchGetHereYouAreTopics: {
    sort: 'newest',
    curPage: 1,
    perPage: 100,
    circleId: null,
    belongsTo: null,
  },
  fetchGetThereYouAreTopics: {
    sort: 'newest',
    curPage: 1,
    perPage: 100,
    circleId: null,
    belongsTo: null,
  },
  fetchGetTopicsSuccess: {
    belongsTo: '',
    data: {},
    paging: {},
  },

  fetchAddTopic: {
    title: null,
    content: null,
    circleId: null,
    belongsTo: null,
    selectedImage: null,
    onSuccess: null,
  },

  resetTopic: {
    belongsTo: '',
  },
  createTopic: {
    belongsTo: '',
    data: {},
  },
  deleteTopicById: {
    belongsTo: '',
    id: '',
  },
  replaceTopics: {
    belongsTo: '',
    data: {},
    paging: {},
  },
  updateTopics: {
    belongsTo: '',
    data: {},
    paging: {},
  },
  updateTopicByKey: {
    belongsTo: '',
    key: '',
    data: {},
    sortBy: '',
  },

  fetchPostTopic: ['id', 'data', 'replySuccess'],
  fetchPostTopicPost: ['id', 'data', 'replySuccess'],
  fetchReplyPostPost: ['id', 'data', 'replySuccess'],
});

export const TopicTypes = Types;
export default Creators;
