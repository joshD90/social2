import { FC } from "react";

type Props = {
  label: string;
  type: string;
  name: string;
  value: string | number;
  updateField: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputError?: { [key: string]: string };
};

const PrimitiveInput: FC<Props> = ({
  label,
  type,
  name,
  updateField,
  value,
  inputError,
}) => {
  return (
    <div className="flex flex-col w-full ">
      <label htmlFor={name} className="text-stone-50">
        {label}
      </label>
      <input
        type={type}
        name={name}
        className="p-2 w-full rounded-sm"
        onChange={(e) => updateField(e)}
        value={
          value
            ? value
            : type === "text" || type === "email" || type === "password"
            ? ""
            : 0
        }
      />
      {inputError && inputError[name] && (
        <p className="text-red-400">{inputError[name]}</p>
      )}
    </div>
  );
};

export default PrimitiveInput;
