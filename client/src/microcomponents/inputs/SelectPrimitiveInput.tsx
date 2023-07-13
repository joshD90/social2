import { FC } from "react";

type Props = {
  optionArray: (string | number)[];
  label: string;
  name: string;
  updateField: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const SelectPrimitiveInput: FC<Props> = ({
  optionArray,
  name,
  label,
  updateField,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-stone-800">
        {label}
      </label>
      <select
        name={name}
        onChange={updateField}
        className="p-2 border-none rounded-sm"
      >
        {optionArray.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectPrimitiveInput;