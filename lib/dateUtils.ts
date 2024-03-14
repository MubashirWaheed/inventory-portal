import { endOfMonth, subMonths } from "date-fns";
import { currentUtcDate } from "./currentUtcDate";

export const lastDayOfPreviousMonth = () => {
  const today = currentUtcDate();
  // Subtract one month from today's date
  const lastMonth = subMonths(today, 1);

  // Get the last day of the previous month
  const lastDayOfPreviousMonth = endOfMonth(lastMonth);

  lastDayOfPreviousMonth.setUTCHours(0, 0, 0, 0);

  return lastDayOfPreviousMonth;
};

export const firstDayOfPreviousMonth = () => {
  const today = currentUtcDate();

  // Calculate the first day of the current month
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Calculate the first day of the previous month
  const firstDayOfPreviousMonth = new Date(firstDayOfMonth);
  firstDayOfPreviousMonth.setMonth(firstDayOfPreviousMonth.getMonth() - 1);
  return firstDayOfPreviousMonth;
};

export const firstDayOfMonth = () => {
  const today = currentUtcDate();
  // Calculate the first day of the current month
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return firstDayOfMonth;
};
