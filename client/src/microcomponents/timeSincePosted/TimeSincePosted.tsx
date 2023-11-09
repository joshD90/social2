import { FC, useEffect, useState } from "react";

type Props = { dateTime: string; edited?: boolean };

const TimeSincePosted: FC<Props> = ({ dateTime, edited }) => {
  const [timeSinceText, setTimeSinceText] = useState("");
  const postedOrEdit = edited ? "Edited" : "Posted";
  useEffect(() => {
    const timePosted = new Date(dateTime);
    const now = new Date(Date.now());
    const determineDifference = () => {
      const yearDiff = now.getFullYear() - timePosted.getFullYear();
      if (yearDiff === 1) return `${postedOrEdit} last Year`;
      if (yearDiff > 1) return `${postedOrEdit} ${yearDiff} years ago`;
      const monthDiff = now.getMonth() - timePosted.getMonth();
      if (monthDiff === 1) return `${postedOrEdit} last month`;
      if (monthDiff > 1) return `${postedOrEdit} ${monthDiff} months ago`;
      const dayDiff = now.getDay() - timePosted.getDay();
      if (dayDiff === 1) return `${postedOrEdit} yesterday`;
      if (dayDiff > 1) return `${postedOrEdit} ${dayDiff} days ago`;
      const hourDiff = now.getHours() - timePosted.getHours();
      if (hourDiff === 1) return `${postedOrEdit} one hour ago`;
      if (hourDiff > 1) return `${postedOrEdit} ${hourDiff} hours ago`;
      return `${postedOrEdit} just now`;
    };
    setTimeSinceText(determineDifference());
  }, [dateTime, postedOrEdit]);
  return <p>{timeSinceText}</p>;
};

export default TimeSincePosted;
