import React, { FC, useState } from "react";
import { IServicePhoneContact } from "../../types/serviceTypes/Service";
import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";
import { twThemeColors } from "../../assets/themeColors/twThemeColors";
import { MdArrowDownward } from "react-icons/md";

export const serviceContactDummyData: IServicePhoneContact[] = [
  { phone_number: "0851234567", details: "Mary Wholloper", public: true },
  { phone_number: "0851234567", details: "Mary Wholloper", public: true },
];

type Props = { numbers: IServicePhoneContact[]; color: ThemeColor };

const ServiceContactDisplay: FC<Props> = ({ numbers, color }) => {
  const [contactsDropped, setContactsDropped] = useState(false);

  const toggleContacts = () => {
    setContactsDropped((prev) => !prev);
  };

  if (numbers.length === 1) {
    return (
      <div
        className={`flex border-2 text-stone-800 ${twThemeColors.border[color]}`}
      >
        <p className="bg-stone-400 p-2 w-36">Contact Number</p>
        <div className="flex gap-2 items-center p-2 flex-grow bg-stone-50">
          <p>{numbers[0].details}</p>
          <p>{numbers[0].phone_number}</p>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`${twThemeColors.border[color]} border-2 w-full my-2 text-stone-800 relative border-b-0"
      `}
    >
      <div
        className="w-full flex justify-between bg-stone-400 p-2"
        onClick={toggleContacts}
      >
        Contact Numbers <MdArrowDownward />
      </div>
      <div
        className={`${
          !contactsDropped && "h-0"
        } overflow-hidden transition-all absolute top-full border-2 border-t-0 ${
          twThemeColors.border[color]
        }`}
        style={{ width: "calc(100% + 4px", left: "-2px" }}
      >
        <table className="w-full bg-stone-50">
          <thead>
            <tr className="text-left">
              <th>Details</th>
              <th>Number</th>
            </tr>
          </thead>
          <tbody>
            {numbers.map((number, index) => (
              <tr key={index}>
                <td>{number.details}</td>
                <td>{number.phone_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceContactDisplay;
