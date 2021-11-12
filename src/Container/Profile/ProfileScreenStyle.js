import { StyleSheet, Screen } from "~/Helper";
import { Colors, Metrics } from "~/Theme";

export default StyleSheet.create({
  navBar: {
    backgroundColor: Colors.pureWhite,
    // paddingHorizontal: Screen.scale(16),
  },
  content: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "space-between",
    paddingHorizontal: Screen.scale(24),
    paddingBottom: Screen.scale(49),
    paddingTop: Screen.scale(33),
    backgroundColor: Colors.paleGrey,
  },
  header: {
    flex: 0.28,
  },
  horizontalLine: {
    paddingTop: Screen.scale(16),
    borderRadius: Screen.scale(100),
    borderBottomColor: Colors.silverTwo,
    borderBottomWidth: 1,
    borderStyle: "solid",
  },
});
