const capitaliseFirstLetter = (str: string): string => {
  if (str === "") return "";
  const firstLetter = str[0].toUpperCase();
  const remainder = str.slice(1);
  return firstLetter + remainder;
};

export default capitaliseFirstLetter;
