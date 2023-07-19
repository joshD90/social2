import { FC } from "react";

type Props = {
  optionArray: { name: string | number; value: string | number }[];
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
      <label htmlFor={name} className="text-stone-50">
        {label}
      </label>
      <select
        name={name}
        onChange={updateField}
        className="p-2 border-none rounded-sm"
      >
        <option value="noneSelected">None Selected</option>
        {optionArray.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectPrimitiveInput;
