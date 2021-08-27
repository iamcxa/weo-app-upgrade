import { Colors } from '~/Theme';
import { Screen, ScaledSheet } from '~/Helpers';

export default ScaledSheet.create({
  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    flex: 1,
    minWidth: Screen.moderateScale(120),
    minHeight: Screen.moderateScale(60),
    padding: Screen.moderateScale(16),
    borderRadius: Screen.moderateScale(30),
    zIndex: 999999,
  },
  title: {
    color: Colors.blackFour,
    fontWeight: '600',
    fontSize: Screen.moderateScale(16),
  },
  icon: {
    paddingLeft: Screen.moderateScale(8),
  },
  markerImage: {
    padding: Screen.moderateScale(5),
    width: Screen.moderateScale(40),
    height: Screen.moderateScale(40),
    alignSelf: 'center',
    marginBottom: Screen.moderateScale(-4),
  },
  marker: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 100,
  },
  titleSmall: {
    fontSize: Screen.moderateScale(12),
    textAlign: 'center',
  },
});
