import { StyleSheet } from '~/Helpers';
import { Colors, Metrics, Classes } from '~/Theme';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.shadowColor,
  },
  panel: {
    borderWidth: 1,
    borderColor: Colors.shadowColor,
    borderRadius: '10@s',
    backgroundColor: Colors.pureWhite,
    padding: Metrics.baseMargin * 2,
    // paddingBottom: Metrics.baseMargin * 2,
    width: '90%',
    elevation: 1,
    shadowOpacity: 1,
    shadowRadius: '10@s',
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  headerWrapper: {
    paddingLeft: Metrics.baseMargin,
    alignItems: 'flex-end',
  },
  titleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: Metrics.baseMargin * 2,
    // marginBottom: Metrics.baseMargin * 4,
  },
  txtWrapper: {
    margin: Metrics.baseMargin * 2,
    marginLeft: 0,
    justifyContent: 'space-between',
  },
  rowWrapper: {
    ...Classes.fillRowCenter,
    paddingHorizontal: Metrics.baseMargin * 2,
  },
  btnBase: {
    width: 'auto',
    height: 'auto',
  },
  btnHasPermission: {
    backgroundColor: Colors.dodgerblue,
    borderColor: Colors.dodgerblue,
    opacity: 1,
  },
  btnRequest: {
    width: '100@s',
    height: 'auto',
    alignSelf: 'center',
    padding: Metrics.baseMargin,
    backgroundColor: Colors.paleGrey,
    borderColor: Colors.paleGrey,
    borderRadius: '20@s',
  },
  icon: {
    marginRight: Metrics.baseMargin,
  },
  contentWrapper: {
    ...Classes.fillRowCenter,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: Metrics.baseMargin,
  },
  borderBottom: {
    borderBottomWidth: 1 / 2,
    borderBottomColor: Colors.warmGrey,
  },
  txtSecondLine: {
    marginTop: Metrics.baseMargin,
    color: Colors.warmGrey,
    width: '140@s',
  },
  txtRequestStar: {
    color: Colors.red,
    fontWeight: 'bold',
  },
});
