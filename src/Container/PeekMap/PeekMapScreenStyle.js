import { ScaledSheet, Screen } from '~/Helpers';
import { Metrics, Colors, Classes } from '~/Theme';

export default ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pureWhite,
  },
  navBar: {
    backgroundColor: Colors.pureWhite,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  clusterContainer: {
    width: Screen.scale(48),
    height: Screen.scale(48),
    padding: 6,
    borderWidth: 1,
    borderRadius: 24,
    alignItems: 'center',
    borderColor: '#65bc46',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  clusterText: {
    fontSize: 13,
    color: '#65bc46',
    fontWeight: '500',
    textAlign: 'center',
  },
  userLocationButton: {
    position: 'absolute',
    right: Screen.scale(19),
    bottom: Screen.verticalScale(48),
    backgroundColor: '#FFFFFF',
    width: Screen.scale(32),
    height: Screen.scale(32),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: Screen.scale(50),
    shadowOpacity: 1,
    borderRadius: Screen.scale(5),
    elevation: 5,
  },
  userLocationIcon: {
    width: Screen.scale(16),
    height: Screen.verticalScale(16),
  },
  navTitleContainer: {
    ...Classes.fillCenter,
    ...Classes.rowCenter,
  },
  titleText: {
    fontSize: Screen.scale(18),
    paddingHorizontal: Screen.scale(10),
  },
  titleLoading: {
    position: 'absolute',
    right: Screen.scale(-16),
  },
});
