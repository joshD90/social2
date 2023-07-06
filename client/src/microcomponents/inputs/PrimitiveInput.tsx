import { FC } from "react";

type Props = {
  label: string;
  type: string;
  name: string;
  value: string | number;
  updateField: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PrimitiveInput: FC<Props> = ({
  label,
  type,
  name,
  updateField,
  value,
}) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name} className="text-stone-800">
        {label}
      </label>
      <input
        type={type}
        name={name}
        className="p-2 w-full"
        onChange={(e) => updateField(e)}
        value={
          value
            ? value
            : type === "text" || type === "email" || type === "password"
            ? ""
            : 0
        }
      />
    </div>
  );
};

export default PrimitiveInput;
