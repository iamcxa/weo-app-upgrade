/**
 * The initial values for the redux state.
 */
export const INITIAL_STATE = {
  // the circle which user chose to stay.
  userCircle: {},
  prevUserCircle: {},
  // the circle that decided by the system.
  currentCircle: {},
  // circles that the user is currently inside of it.
  insideCircles: [],
  // circles that surrounded beside the user in a range of distances.
  nearCircles: [],
  leftCircleTime: null,
  leftAppTime: null,

  // user fav circle - there your are circle
  homeCircle: null,
};
