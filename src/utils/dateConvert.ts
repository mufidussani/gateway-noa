function convertOrdinalToDatetime(data: any): string {
  const originalDateTimeString: string = "2023-08-02T11:41:43.000Z";

  // Parse the original datetime string to a Date object
  const originalDate: Date = new Date(originalDateTimeString);

  // Convert the date to the desired format
  const formattedDate: string = originalDate.toLocaleString("en-Gb", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour format
    timeZone: "UTC", // Use UTC timezone (since the input string has a 'Z' at the end)
  });

  return formattedDate;
}

function formatDateTime(dateTimeString: string): string {
  const dateTime: Date = new Date(dateTimeString);

  const year: number = dateTime.getUTCFullYear();
  const month: string = String(dateTime.getUTCMonth() + 1).padStart(2, "0");
  const day: string = String(dateTime.getUTCDate()).padStart(2, "0");
  const hours: string = String(dateTime.getUTCHours() + 7).padStart(2, "0"); // Adding 7 hours for your timezone
  const minutes: string = String(dateTime.getUTCMinutes()).padStart(2, "0");
  const seconds: string = String(dateTime.getUTCSeconds()).padStart(2, "0");

  const formattedDateTime: string = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}

function formatDate(dateTimeString: string): string {
  const originalDate: Date = new Date(dateTimeString);
  const newDate: Date = new Date(originalDate.getTime() + 2.52e7 + 1000);

  const year: number = newDate.getUTCFullYear();
  const month: string = String(newDate.getUTCMonth() + 1).padStart(2, "0");
  const day: string = String(newDate.getUTCDate()).padStart(2, "0");

  const formattedDate: string = `${year}-${month}-${day}`;

  return formattedDate;
}

function convertDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidDate(dateString: string): boolean {
  // Regular expression to match YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  // Check if the string matches the regex
  if (!regex.test(dateString)) {
    return false;
  }

  // Further validation for correct date values
  const parts = dateString.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  // JavaScript months are 0-based, so January is 0, February is 1, etc.
  const date = new Date(year, month - 1, day);

  // Check if the date components match the input
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isValidDateTime(dateTimeString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  return regex.test(dateTimeString);
}

function parseTimeToDate(time: string): Date {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds, 0);
  return date;
}

//date convert
function timeStringToUnixTime(timeString: string): number {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const now = new Date();
  now.setHours(hours, minutes, seconds, 0);
  return Math.floor(now.getTime() / 1000);
}

function getCurrentTimeString(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export {
  convertOrdinalToDatetime,
  formatDateTime,
  formatDate,
  convertDateToString,
  isValidDate,
  isValidDateTime,
  timeStringToUnixTime,
  getCurrentTimeString
};
