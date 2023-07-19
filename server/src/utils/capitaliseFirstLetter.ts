const capitaliseFirstLetter = (str: string): string => {
  const firstLetter = str[0].toUpperCase();
  const remainder = str.slice(1);
  return firstLetter + remainder;
};

export default capitaliseFirstLetter;
