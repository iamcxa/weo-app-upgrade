import { Platform, StyleSheet as RNStyleSheet } from "react-native";
import { StyleSheet, Screen } from "~/Helper";
import { Colors } from "~/Theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    // height: Screen.height,
    justifyContent: "space-around",
    alignItems: "stretch",
    paddingLeft: Screen.scale(36),
    paddingRight: Screen.scale(36),
  },
  navBar: {
    paddingHorizontal: Screen.scale(16),
    // zIndex: 100,
  },
  selectAvatar: {
    width: Screen.scale(120),
    height: Screen.scale(120),
    borderRadius: Screen.scale(60),
    borderWidth: Screen.scale(10),
    borderColor: Colors.mainYellow,
    marginTop: Screen.scale(31),
    backgroundColor: Colors.paleGreyTwo,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    resizeMode: "cover",
    width: Screen.scale(120),
    height: Screen.scale(120),
    borderRadius: Screen.scale(60),
    borderWidth: Screen.scale(10),
    borderColor: Colors.mainYellow,
  },
  titleText: {
    fontWeight: Platform.OS === "ios" ? "900" : "500",
    color: Colors.black,
  },
  inputLabel: {
    fontWeight: Platform.OS === "ios" ? "900" : "500",
    color: Colors.black,
    marginBottom: Screen.scale(23),
  },
  titleContainer: {
    flex: Screen.virtualBar ? 1.6 : 2,
    // flex: 2,
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: Screen.scale(25),
  },
  errorMsg: {
    fontSize: Screen.scale(12),
    color: Colors.pink,
  },
  skewed: {
    zIndex: 0,
    height: Screen.height * 0.35,
    position: "absolute",
    bottom: Screen.scale(-60),
    backgroundColor: Colors.pureWhite,
    alignSelf: "center",
    width: Screen.width + 300,
    transform: [{ skewY: "350deg" }],
  },
  companyName: {
    fontWeight: "600",
    position: "absolute",
    zIndex: 1,
    // backgroundColor: 'rgba(0,0,0,0)',
    bottom: Screen.scale(25),
  },
  nameInput: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: Screen.scale(18),
    color: Colors.blackTwo,
    width: "100%",
    paddingBottom: Screen.scale(10),
    borderBottomWidth: RNStyleSheet.hairlineWidth,
  },
  startBtn: {
    width: Screen.width - Screen.scale(34),
    zIndex: 1,
  },
  startBtnText: {
    fontSize: 20,
    fontWeight: "900",
  },
  btnRandomName: {
    marginTop: 10,
    backgroundColor: Colors.mainYellow,
    borderColor: Colors.mainYellow,
  },
  primaryBtnContainer: {
    flex: 1.2,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
  },
});
