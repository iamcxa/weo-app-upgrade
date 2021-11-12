import { Colors } from "~/Theme";
import { Screen, ScaledSheet } from "~/Helper";

export default ScaledSheet.create({
  callout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "auto",
    flex: 1,
    minWidth: Screen.scale(120),
    minHeight: Screen.scale(60),
    padding: Screen.scale(16),
    borderRadius: Screen.scale(30),
    zIndex: 999999,
  },
  title: {
    color: Colors.blackFour,
    fontWeight: "600",
    fontSize: Screen.scale(16),
  },
  icon: {
    paddingLeft: Screen.scale(8),
  },
  markerImage: {
    padding: Screen.scale(5),
    width: Screen.scale(40),
    height: Screen.scale(40),
    alignSelf: "center",
    marginBottom: Screen.scale(-4),
  },
  marker: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    zIndex: 100,
  },
  titleSmall: {
    fontSize: Screen.scale(12),
    textAlign: "center",
  },
});
