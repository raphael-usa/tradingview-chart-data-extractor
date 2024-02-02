

export const delay = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};


export function formatCurrentTime() {
  const now = new Date();

  // Extracting components of the date and time
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const month = now.getMonth() + 1; // Months are zero-based
  const day = now.getDate();
  const year = now.getFullYear();

  // Formatting the time into "hr:min:sec" format
  const formattedTime = `${hours}:${padZero(minutes)}:${padZero(seconds)}`;

  // Formatting the date into "month/day/year" format
  const formattedDate = `${padZero(month)}/${padZero(day)}/${year}`;

  // Combining the time and date
  const formattedDateTime = `${formattedTime} ${formattedDate}`;

  return formattedDateTime;
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
  return number < 10 ? `0${number}` : number;
}