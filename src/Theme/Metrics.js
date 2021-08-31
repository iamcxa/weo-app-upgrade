/**
 * This file contains metric values that are global to the application.
 */

import { Screen } from 'App/Helpers';

export default {
  // Examples of metrics you can define:
  // baseMargin: 10,
  // largeMargin: 20,
  // smallMargin: 5,
  navBarHeight: Screen.verticalScale(56),
  baseMargin: Screen.scale(8),
  baseVerticalMargin: Screen.verticalScale(8),

  baseNavBarHeight: Screen.verticalScale(44),
  baseNavBarHeightRaw: 44,

  REPLY_BAR_HEIGHT: Screen.scale(64),
};
