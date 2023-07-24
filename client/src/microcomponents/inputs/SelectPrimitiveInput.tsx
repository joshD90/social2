import { FC } from "react";

type Props = {
  optionArray: { name: string | number; value: string | number }[];
  label: string;
  name: string;
  updateField: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string | number;
  inputError?: { [key: string]: string };
};

const SelectPrimitiveInput: FC<Props> = ({
  optionArray,
  name,
  label,
  updateField,
  value,
  inputError,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-stone-50">
        {label}
      </label>
      <select
        name={name}
        onChange={updateField}
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
      {inputError && inputError[name] && <p>{inputError[name]}</p>}
    </div>
  );
};

export default SelectPrimitiveInput;
