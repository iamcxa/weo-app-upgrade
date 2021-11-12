import { logger } from "react-native-logs";

import Config from "../Config";

const log = __DEV__ ? console : logger.createLogger(Config.LOGGER);

export default log;
