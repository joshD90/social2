import { FC, useEffect, useState } from "react";

type Props = { dateTime: string };

const TimeSincePosted: FC<Props> = ({ dateTime }) => {
  const [timeSinceText, setTimeSinceText] = useState("");

  useEffect(() => {
    const timePosted = new Date(dateTime);
    const now = new Date(Date.now());
    const determineDifference = () => {
      const yearDiff = now.getFullYear() - timePosted.getFullYear();
      if (yearDiff === 1) return "Posted last Year";
      if (yearDiff > 1) return `Posted ${yearDiff} years ago`;
      const monthDiff = now.getMonth() - timePosted.getMonth();
      if (monthDiff === 1) return "Posted last month";
      if (monthDiff > 1) return `Posted ${monthDiff} months ago`;
      const dayDiff = now.getDay() - timePosted.getDay();
      if (dayDiff === 1) return "Posted yesterday";
      if (dayDiff > 1) return `Posted ${dayDiff} days ago`;
      const hourDiff = now.getHours() - timePosted.getHours();
      if (hourDiff === 1) return "Posted one hour ago";
      if (hourDiff > 1) return `Posted ${hourDiff} hours ago`;
      return "Posted just now";
    };
    setTimeSinceText(determineDifference());
  }, [dateTime]);
  return <p>{timeSinceText}</p>;
};

export default TimeSincePosted;
