import {} from "react-native";
import { Screen, ScaledSheet, ifIphoneX } from "App/Helpers";
import { Metrics } from "App/Theme";

export default ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    width: Screen.width,
  },
  navBar: {
    height: Metrics.navBarHeight,
    width: "auto",
  },
  wording: {
    marginTop: 13,
    fontWeight: "bold",
    fontSize: 16,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  //
  replyBar: {
    position: "absolute",
    // left: 0,
    bottom: ifIphoneX(-16, 0),
    backgroundColor: "white",
    zIndex: 500,
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  action: {
    textAlign: "center",
    color: "#0000FF",
    marginVertical: 5,
    fontWeight: "bold",
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  stat: {
    textAlign: "center",
    color: "#B0171F",
    marginBottom: 1,
  },
  micButton: {
    marginTop: 20,
    flex: 0.6,
    zIndex: 500,
  },
  micAnimation: {
    width: "260@s",
    height: "260@s",
    // backgroundColor: 'gray',
    zIndex: -1,
  },
  selectedLanguage: {
    flexWrap: "wrap",
    alignItems: "center",
    flexDirection: "row",
  },
});
