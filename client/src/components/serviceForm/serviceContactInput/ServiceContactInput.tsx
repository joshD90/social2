import { FC, useState } from "react";
import { IServicePhoneContact } from "../../../types/serviceTypes/Service";
import serviceContactFormValidation from "../../../utils/formValidation/serviceFormValidation/serviceContactFormValidation/serviceContactFormValidation";
import { MdAdd } from "react-icons/md";

type Props = {
  value: IServicePhoneContact[];
  updateField: (name: string, value: IServicePhoneContact[]) => void;
  fieldName: string;
};

const ServiceContactInput: FC<Props> = ({ value, updateField, fieldName }) => {
  const [singleContact, setSingleContact] = useState(singleContactInitialValue);
  const [error, setError] = useState<{ [key: string]: string }>({});
  //updates the single contact currently in form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "public")
      return setSingleContact((prev) => ({
        ...prev,
        public: e.target.checked,
      }));
    if (e.target.id !== "details" && e.target.id !== "phone_number") return;
    setSingleContact((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  //add to the overall form state
  const handleAddContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({});
    const validated = await serviceContactFormValidation(singleContact);

    if (validated instanceof Error)
      return setError((prev) => ({ ...prev, general: validated.message }));

    if (Object.keys(validated.errors).length > 0)
      return setError((prev) => ({ ...prev, ...validated.errors }));

    updateField(fieldName, [...value, singleContact]);
    setSingleContact(singleContactInitialValue);
  };

  return (
    <div className="text-stone-50 col-span-2">
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
          <label htmlFor="">Number</label>
          {error.phone_number ? (
            <p className="text-red-500">{error.phone_number}</p>
          ) : null}
          <input
            type="text"
            className="p-1 text-stone-800"
            id="phone_number"
            onChange={handleInputChange}
            value={singleContact.phone_number}
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
          <div className="flex items-center">
            <p>{contact.details}</p>
            <p>{contact.phone_number}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const singleContactInitialValue: IServicePhoneContact = {
  details: "",
  phone_number: "",
  public: false,
};
export default ServiceContactInput;
