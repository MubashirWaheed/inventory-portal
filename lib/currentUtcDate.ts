// Function to retrieve current date with UTC hours set to 0
export function currentUtcDate(): Date {
  const currentDate = new Date();
  currentDate.setUTCHours(0, 0, 0, 0);
  return currentDate;
}
