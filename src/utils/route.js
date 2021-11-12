import _ from "lodash";
import { Actions } from "react-native-router-flux";

export function getRoutePrefix() {
  const prefix = _.split(Actions.currentScene, "_", 1)[0];
  return prefix;
}
