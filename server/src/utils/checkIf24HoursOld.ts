export const checkIf24HoursOld = (pastDateString: string) => {
  const pastDate = new Date(pastDateString);
  const currentTime = Date.now();

  if (pastDate.toString() === "Invalid Date") throw Error("Invalid Date");

  const timeDiff = currentTime - pastDate.getTime();

  const oneDay = 24 * 60 * 60 * 1000;
  if (timeDiff > oneDay) return false;

  return true;
};
