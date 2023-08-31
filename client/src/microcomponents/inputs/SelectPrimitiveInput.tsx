import { FC, SetStateAction } from "react";

type Props = {
  optionArray: { name: string | number; value: string | number }[];
  label: string;
  name: string;
  updateField: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string | number;
  inputError?: { [key: string]: string };
  setInputError?: React.Dispatch<SetStateAction<{ [key: string]: string }>>;
};

const SelectPrimitiveInput: FC<Props> = ({
  optionArray,
  name,
  label,
  updateField,
  value,
  inputError,
  setInputError,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateField(e);
    setInputError &&
      setInputError((prev) => ({ ...prev, [e.target.name]: "" }));
  };
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-stone-50">
        {label}
      </label>
      <select
        name={name}
        onChange={handleChange}
        className="p-2 border-none rounded-sm"
      >
        {!value && (
          <option value={value ? value : "noneSelected"}>
            {optionArray.find((opt) => opt.value === value)?.name ||
              "None Selected"}
          </option>
        )}
        {optionArray.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.name}
          </option>
        ))}
      </select>
      {inputError && inputError[name] && (
        <p className="text-red-400">{inputError[name]}</p>
      )}
    </div>
  );
};

export default SelectPrimitiveInput;
