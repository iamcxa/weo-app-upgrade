import { ENABLE_LOGGER } from "@env";
import { consoleTransport } from "react-native-logs";

const defaultConfig = {
  severity: "debug",
  transport: consoleTransport,
  transportOptions: {
    color: "ansi", // custom option that color consoleTransport logs
  },
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  async: true,
  dateFormat: "time",
  printLevel: true,
  printDate: true,
  enabled: ENABLE_LOGGER,
};

export default defaultConfig;
