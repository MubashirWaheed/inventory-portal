// Function to retrieve current date with UTC hours set to 0
export function convertToUtcDate(date: any): Date {
  const utcDate = new Date(date);
  utcDate.setUTCHours(0, 0, 0, 0);
  return utcDate;
}
