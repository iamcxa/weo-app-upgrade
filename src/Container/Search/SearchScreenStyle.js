import { StyleSheet, Screen } from "~/Helper";
import { Fonts, Styles, Colors, Metrics } from "~/Theme";

export default StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: Screen.scale(26),
    paddingHorizontal: Screen.scale(16),
  },
  inputWrapper: {
    borderRadius: Screen.scale(10),
    backgroundColor: Colors.steel10,
    // justifyContent: 'center',
    alignItems: "center",
    paddingVertical: Screen.scale(6),
    flexDirection: "row",
  },
  searchInput: {
    fontSize: Screen.scale(18),
    fontWeight: "500",
    color: Colors.black,
    // marginTop: Screen.scale(15),
    // height: Screen.scale(100),
    textAlignVertical: "top",
    flex: 1,
  },
  searchIcon: {
    marginHorizontal: Screen.scale(12),
    tintColor: Colors.steel,
  },
  hotSearchList: {
    paddingTop: Screen.scale(6),
    marginBottom: Metrics.baseMargin * 2,
    paddingHorizontal: Screen.scale(12),
  },
  hotSearchListItem: {
    marginVertical: Screen.scale(12),
  },
  hotSearchKeyword: {
    fontSize: Screen.scale(16),
    fontWeight: "500",
    fontStyle: "normal",
    color: Colors.greyishBrown,
  },
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  listEmptyMessage: {
    alignSelf: "center",
    textAlign: "center",
    lineHeight: 30,
  },
});
