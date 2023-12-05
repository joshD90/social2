import { FC, useEffect, useState } from "react";
import {
  IServiceEmailContact,
  IServicePhoneContact,
} from "../../../types/serviceTypes/Service";
import serviceContactFormValidation from "../../../utils/formValidation/serviceFormValidation/serviceContactFormValidation/serviceContactFormValidation";
import { MdAdd } from "react-icons/md";
import { AiFillMinusCircle } from "react-icons/ai";

type Props =
  | {
      value: IServicePhoneContact[];
      updateField: (name: string, value: IServicePhoneContact[]) => void;
      fieldName: "contactNumber";
    }
  | {
      value: IServiceEmailContact[];
      updateField: (name: string, value: IServiceEmailContact[]) => void;
      fieldName: "contactEmail";
    };

const ServiceContactInput: FC<Props> = ({ value, updateField, fieldName }) => {
  const [singleContact, setSingleContact] = useState(
    fieldName === "contactNumber"
      ? singleContactInitialValue.phone
      : singleContactInitialValue.email
  );
  const [error, setError] = useState<{ [key: string]: string }>({});
  //updates the single contact currently in form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "public")
      return setSingleContact((prev) => ({
        ...prev,
        public: e.target.checked,
      }));
    if (
      e.target.id !== "details" &&
      e.target.id !== "phone_number" &&
      e.target.id !== "email"
    )
      return;
    setSingleContact((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  //add to the overall form state
  const handleAddContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({});
    const validated = await serviceContactFormValidation(singleContact);
    //general errors
    if (validated instanceof Error)
      return setError((prev) => ({ ...prev, general: validated.message }));
    //errors specifically
    if (Object.keys(validated.errors).length > 0) {
      return setError((prev) => ({ ...prev, ...validated.errors }));
    }

    //typescript not inferring the types properly
    fieldName === "contactNumber"
      ? updateField(fieldName, [
          ...(value as IServicePhoneContact[]),
          singleContact as IServicePhoneContact,
        ])
      : updateField(fieldName, [
          ...(value as IServiceEmailContact[]),
          singleContact as IServiceEmailContact,
        ]);

    setSingleContact(
      fieldName === "contactNumber"
        ? singleContactInitialValue.phone
        : singleContactInitialValue.email
    );
  };

  useEffect(() => console.log(error, "error"), [error]);

  //remove contact from overall form state
  const removeContact = (contactInfo: string) => {
    //Typescript coud not work with the types for updateField so a branching structure was adopted
    if (fieldName === "contactNumber") {
      const updatedArray = value.filter(
        (contact) => contact.phone_number !== contactInfo
      ) as IServicePhoneContact[];
      updateField(fieldName, updatedArray);
    } else {
      const updatedArray = value.filter(
        (contact) => contact.email !== contactInfo
      ) as IServiceEmailContact[];

      updateField(fieldName, updatedArray);
    }
  };

  return (
    <div className="text-stone-50 col-span-2">
      <h4 className="font-bold">
        {fieldName === "contactNumber" ? "Contact Numbers" : "Contact Emails"}
      </h4>
      {error.general ? <p className="text-red-500">{error.general}</p> : null}
      <form action="" onSubmit={handleAddContact}>
        <div className="flex flex-col">
          <label htmlFor="">Contact Details (name) etc</label>
          {error.details ? (
            <p className="text-red-500">{error.details}</p>
          ) : null}
          <input
            type="text"
            id="details"
            className="p-1 text-stone-800"
            onChange={handleInputChange}
            value={singleContact.details}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">
            {fieldName === "contactNumber" ? "Number" : "Email"}
          </label>
          {error.phone_number || error.email ? (
            <p className="text-red-500">
              {fieldName === "contactNumber" ? error.phone_number : error.email}
            </p>
          ) : null}
          <input
            type="text"
            className="p-1 text-stone-800"
            id={"phone_number" in singleContact ? "phone_number" : "email"}
            onChange={handleInputChange}
            value={
              "phone_number" in singleContact
                ? singleContact.phone_number
                : singleContact.email
            }
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="">Publically Available?</label>
          <input
            type="checkbox"
            id="public"
            onChange={handleInputChange}
            checked={singleContact.public}
          />
        </div>
        <button type="submit">
          <MdAdd />
        </button>
      </form>
      <div className="text-white-50">
        {value.map((contact) => (
          <div
            className="flex items-center gap-2"
            key={
              "phone_number" in contact
                ? contact.phone_number + contact.details
                : contact.email + contact.details
            }
          >
            <p>{contact.details}</p>
            <p>
              {"phone_number" in contact ? contact.phone_number : contact.email}
            </p>
            <button
              onClick={() =>
                removeContact(
                  "phone_number" in contact
                    ? contact.phone_number
                    : contact.email
                )
              }
            >
              <AiFillMinusCircle />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const singleContactInitialValue: {
  phone: IServicePhoneContact;
  email: IServiceEmailContact;
} = {
  phone: {
    details: "",
    phone_number: "",
    public: false,
  },
  email: { details: "", email: "", public: false },
};
export default ServiceContactInput;
