import { StyleSheet } from 'App/Helpers';
import { Metrics } from 'App/Theme';

export default StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  backgroundReset: {
    backgroundColor: 'transparent',
  },
  margin: {
    marginHorizontal: Metrics.baseMargin,
    marginVertical: Metrics.baseVerticalMargin,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  colCenter: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  colCross: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  colMain: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  columnReverse: {
    flexDirection: 'column-reverse',
  },
  crossCenter: {
    alignItems: 'center',
  },
  crossEnd: {
    alignItems: 'flex-end',
  },
  crossStart: {
    alignItems: 'flex-start',
  },
  crossStretch: {
    alignItems: 'stretch',
  },
  fill: {
    flex: 1,
  },
  fillCenter: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  fillCol: {
    flex: 1,
    flexDirection: 'column',
  },
  fillColCenter: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fillColCross: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  fillColMain: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  fillColReverse: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
  fillRow: {
    flex: 1,
    flexDirection: 'row',
  },
  fillRowCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fillRowCross: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fillRowMain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fillRowReverse: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  fullWidth: {
    width: '100%',
  },
  mainCenter: {
    justifyContent: 'center',
  },
  mainEnd: {
    justifyContent: 'flex-end',
  },
  mainSpaceAround: {
    justifyContent: 'space-around',
  },
  mainSpaceBetween: {
    justifyContent: 'space-between',
  },
  mainStart: {
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
  },
  rowCenter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowCross: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  rowMain: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  selfStretch: {
    alignSelf: 'stretch',
  },
  textCenter: {
    textAlign: 'center',
  },
  textJustify: {
    textAlign: 'justify',
  },
  textLeft: {
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },
  marginRight: {
    marginRight: Metrics.baseMargin,
  },
  marginLeft: {
    marginLeft: Metrics.baseMargin,
  },
  marginTop: {
    marginTop: Metrics.baseMargin,
  },
  marginBottom: {
    marginBottom: Metrics.baseMargin,
  },
  padding: {
    padding: Metrics.baseMargin,
  },
  paddingRight: {
    paddingRight: Metrics.baseMargin,
  },
  paddingLeft: {
    paddingLeft: Metrics.baseMargin,
  },
  paddingTop: {
    paddingTop: Metrics.baseMargin,
  },
  paddingBottom: {
    paddingBottom: Metrics.baseMargin,
  },
});
