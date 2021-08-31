import { StyleSheet, Screen } from '~/Helper';
import { Colors, Metrics } from '~/Theme';

export default StyleSheet.create({
  navBar: {
    backgroundColor: Colors.pureWhite,
    // paddingHorizontal: Screen.scale(16),
  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: Screen.moderateScale(24),
    paddingBottom: Screen.moderateScale(49),
    paddingTop: Screen.moderateScale(33),
    backgroundColor: Colors.paleGrey,
  },
  header: {
    flex: 0.28,
  },
  horizontalLine: {
    paddingTop: Screen.moderateScale(16),
    borderRadius: Screen.moderateScale(100),
    borderBottomColor: Colors.silverTwo,
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
});
