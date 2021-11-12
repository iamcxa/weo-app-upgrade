import { padStart } from "lodash";
import moment from "moment";
import momentTimezone from "moment-timezone";

import Config from "~/Config";
// import { AppStore } from '~/Store';

const { API_SERVER_TIME_ZONE } = Config;

export const DEFAULT_DATE_FORMAT = "YYYY/MM/DD";

export const FORMAT_YY_MM_DD_HH_MM_SS = "YYYY-MM-DD HH:mm:ss";

export const FULL_DATE_FORMAT = "MMM DD, YYYY [at] hh:mm A";

export const MINUTE_FORMAT = "hh:mm A";

export const US_DATE_FORMAT = "MM:DD, YYYY";

export const ACHIEVEMENT_DATE_FORMAT = "MMM DD, YYYY";

export const formatDate = (date, format = DEFAULT_DATE_FORMAT) => {
  if (typeof date === "string" && date.includes(" ")) {
    return moment(date).format(format);
  }
  return moment(new Date(date)).format(format);
};

export const transformMinute = (duration) => {
  if (duration > 60) {
    let min = Math.floor(duration / 60);
    let sec = duration - min * 60;
    if (min < 10) {
      min = `0${min}`;
    }
    if (sec < 10) {
      sec = `0${sec}`;
    }
    return `${min}:${sec}`;
  } else if (duration <= 60 && duration > 0) {
    if (duration < 10) {
      return `00:0${duration}`;
    } else {
      return `00:${duration}`;
    }
  } else {
    return "00:00";
  }
};

export const transformDiffTime = (time) => {
  const scheduledAtUTC = momentTimezone.tz(time, "UTC");
  return moment.duration(scheduledAtUTC.diff(moment()));
};

export const transformDiffMinuteTime = (time) => {
  const scheduledAtUTC = momentTimezone.tz(time, "UTC");
  return parseInt(
    moment.duration(scheduledAtUTC.diff(moment())).asMinutes(),
    10
  );
};

export const transformDiffSecondTime = (time) => {
  const scheduledAtUTC = momentTimezone.tz(time, "UTC");
  return parseInt(
    moment.duration(scheduledAtUTC.diff(moment())).asSeconds(),
    10
  );
};

export const transformDate = (time = new Date(), timezone = "UTC") => {
  return moment(moment.utc(time)).tz(timezone).format();
};

export const transformDateToUTC = (
  time,
  timezone,
  format = "YYYY-MM-DD HH:mm:ss"
) => {
  if (typeof time === "string" && time.includes(" ")) {
    return moment
      .utc(moment(time, "YYYY-MM-DD HH:mm:ss").tz(timezone))
      .format(format);
  }
  return moment.utc(moment(new Date(time)).tz(timezone)).format(format);
};

export const getLastFewDays = (days, fromDate = new Date()) => {
  return moment(fromDate).subtract(days, "days").format(DEFAULT_DATE_FORMAT);
};

export const getNextFewDays = (days, fromDate = new Date()) => {
  return moment(fromDate).add(days, "days").format(DEFAULT_DATE_FORMAT);
};

export const getMonthRangeByYear = (
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1
) => {
  // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
  // array is 'year', 'month', 'day', etc
  const startDate = moment([year, month - 1]);

  // Clone the value before .endOf()
  const endDate = moment(startDate).endOf("month");

  // make sure to call toDate() for plain JavaScript date type
  return {
    start: startDate.format(DEFAULT_DATE_FORMAT),
    end: endDate.format(DEFAULT_DATE_FORMAT),
  };
};

export const getMonthRangeByDate = (date, format = DEFAULT_DATE_FORMAT) => {
  const today = moment(new Date(date));
  return {
    startDate: today.startOf("month").format(format),
    endDate: today.endOf("month").format(format),
  };
};

export const getWeekRangeByDate = (date, format = DEFAULT_DATE_FORMAT) => {
  const today = moment(new Date(date));
  const weekdays = [];
  for (let i = 1; i <= 7; i++) {
    weekdays.push(today.clone().isoWeekday(i).format(format));
  }
  return {
    // using isoWeek will calculate a week start by Monday
    // ref: https://stackoverflow.com/a/18875953/8865942
    startDate: today.startOf("isoWeek").format(format),
    endDate: today.endOf("isoWeek").format(format),
    weekdays,
  };
};

export const hhmmss = (secs) => {
  let minutes = Math.floor(secs / 60);
  secs = secs % 60;
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return `${padStart(hours, 2, "0")}:${padStart(minutes, 2, "0")}:${padStart(
    secs,
    2,
    "0"
  )}`;
};

export const mmss = (secs) => {
  return moment.utc(secs * 1000).format("mm:ss");
};

export const mm = (secs) => {
  let minutes = Math.floor(secs / 60);
  return `${padStart(minutes, 2, "0")}`;
};

export const getTimeZoneOffset = (timezone) => {
  const now = moment().utc();
  return 0 - moment.tz.zone(timezone).utcOffset(now) / 60;
};

export const formatUTCDate = (time) => {
  return moment(time, "YYYYMMDDTHH:mm:ssZZ").format("YYYY-MM-DDTHH:mm:ssZZ");
};

export const isAfterDate = (compareDate, targetDate) => {
  return moment(compareDate).isAfter(targetDate);
};

export const isSameOrAfterDate = (compareDate, targetDate) => {
  return moment(compareDate).isSameOrAfter(targetDate);
};

export const humanize = (dateTime, timezone = undefined) => {
  // const {
  //   appState: { currentTimeZone, currentLocales },
  // } = AppStore.getState();
  // if (!timezone) {
  //   timezone = currentTimeZone;
  // }
  const dateTimeAtUTC = momentTimezone.tz(dateTime, API_SERVER_TIME_ZONE);
  return moment(momentTimezone.tz(dateTimeAtUTC, timezone)).fromNow();
};

export default {
  ACHIEVEMENT_DATE_FORMAT,
  DEFAULT_DATE_FORMAT,
  FULL_DATE_FORMAT,
  MINUTE_FORMAT,
  US_DATE_FORMAT,
  formatDate,
  transformMinute,
  transformDiffTime,
  transformDiffMinuteTime,
  transformDiffSecondTime,
  transformDate,
  transformDateToUTC,
  getLastFewDays,
  getNextFewDays,
  getMonthRangeByYear,
  getWeekRangeByDate,
  formatUTCDate,
  getTimeZoneOffset,
  getMonthRangeByDate,
  hhmmss,
  mmss,
  mm,
  humanize,
  moment,
  isAfterDate,
  isSameOrAfterDate,
  FORMAT_YY_MM_DD_HH_MM_SS,
};
