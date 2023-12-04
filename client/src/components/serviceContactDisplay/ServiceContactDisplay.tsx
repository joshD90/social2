import { FC, useState } from "react";
import {
  IServiceEmailContact,
  IServicePhoneContact,
} from "../../types/serviceTypes/Service";
import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";
import { twThemeColors } from "../../assets/themeColors/twThemeColors";
import { MdArrowDownward } from "react-icons/md";

type Props = {
  contacts: IServicePhoneContact[] | IServiceEmailContact[];
  color: ThemeColor;
};

const ServiceContactDisplay: FC<Props> = ({ contacts, color }) => {
  const [contactsDropped, setContactsDropped] = useState(false);

  const toggleContacts = () => {
    setContactsDropped((prev) => !prev);
  };

  if (contacts.length === 1) {
    return (
      <div
        className={`flex border-2 text-stone-800 ${twThemeColors.border[color]}`}
      >
        <p className="bg-stone-400 p-2 w-36">Contact Number</p>
        <div className="flex gap-2 items-center p-2 flex-grow bg-stone-50">
          <p>{contacts[0].details}</p>
          <p>
            {"phone_number" in contacts[0]
              ? contacts[0].phone_number
              : contacts[0].email}
          </p>
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
            {contacts.map((contact, index) => (
              <tr key={index}>
                <td>{contact.details}</td>
                <td>
                  {"phone_number" in contact
                    ? contact.phone_number
                    : contact.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceContactDisplay;
