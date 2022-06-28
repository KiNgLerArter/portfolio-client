import { formatInTimeZone } from "date-fns-tz";

export const convertToDBFormat = (date: Date) => {
  return formatInTimeZone(date, "America/New_York", "yyyy-MM-dd HH:mm:ss XXX");
};
