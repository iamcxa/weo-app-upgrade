/**
 * The initial values for the redux state.
 */
export const INITIAL_STATE = {
  byId: {},
  allIds: [],
  paging: {
    lastPage: 0,
    curPage: 0,
    perPage: 100,
    total: 0,
    sort: 'DESC',
    by: null,
  },
  isFetching: false,
};