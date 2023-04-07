import dayjs from 'dayjs';
import dayjsBusinessDays from 'dayjs-business-days';
 
dayjs.extend(dayjsBusinessDays);

export const daysUntil = (futureDate) => {

  const currentDate = dayjs();

  return dayjs(dayjs(futureDate)).businessDiff(currentDate);

}

export const dateDiff = (from, to) => from && to ? dayjs(dayjs(to)).businessDiff(dayjs(from)) : undefined

export const yyyyMMDD = (date) => date ? dayjs(date).format("YYYY-MM-DD") : undefined

export const today = () => dayjs()

export const dateAdd = (from, daysToAdd) => yyyyMMDD(dayjs(from).add(daysToAdd, "day"))