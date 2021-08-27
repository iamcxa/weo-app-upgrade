import { StyleSheet, Screen } from 'App/Helpers';
import { Fonts, Styles, Colors, Metrics } from 'App/Theme';

export default StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: Screen.moderateScale(26),
    paddingHorizontal: Screen.moderateScale(16),
  },
  inputWrapper: {
    borderRadius: Screen.moderateScale(10),
    backgroundColor: Colors.steel10,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Screen.moderateScale(6),
    flexDirection: 'row',
  },
  searchInput: {
    fontSize: Screen.moderateScale(18),
    fontWeight: '500',
    color: Colors.black,
    // marginTop: Screen.moderateScale(15),
    // height: Screen.moderateScale(100),
    textAlignVertical: 'top',
    flex: 1,
  },
  searchIcon: {
    marginHorizontal: Screen.moderateScale(12),
    tintColor: Colors.steel,
  },
  hotSearchList: {
    paddingTop: Screen.moderateScale(6),
    marginBottom: Metrics.baseMargin * 2,
    paddingHorizontal: Screen.moderateScale(12),
  },
  hotSearchListItem: {
    marginVertical: Screen.moderateScale(12),
  },
  hotSearchKeyword: {
    fontSize: Screen.moderateScale(16),
    fontWeight: '500',
    fontStyle: 'normal',
    color: Colors.greyishBrown,
  },
  listEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  listEmptyMessage: {
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 30,
  },
});
