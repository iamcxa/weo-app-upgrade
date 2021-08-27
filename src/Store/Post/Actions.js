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
  updatePostStore: ['data'],

  createPost: ['target', 'data'],
  updatePost: ['belongsTo', 'data'],
  updatePostSuccess: { belongsTo: '', data: {} },
  updatePostByKey: { belongsTo: '', key: '', data: {} },
  resetPost: ['target'],
  deletePostById: { belongsTo: '', id: '' },
  fetchGetPost: {
    topicId: '',
    curPage: '',
    belongsTo: '',
    handleNextPage: null,
  },
  fetchPostHidePost: ['id', 'type', 'belongsTo'],
  fetchPostReply: ['id', 'data'],
  fetchGetSinglePost: ['id', 'getSuccess'],
  updateTopicByKey: { belongsTo: '', key: '', data: {} },
});

export const PostTypes = Types;
export default Creators;
