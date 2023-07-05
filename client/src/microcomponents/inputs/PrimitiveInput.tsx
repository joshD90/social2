import { FC } from "react";

type Props = {
  label: string;
  type: string;
  name: string;
  value?: string | number;
};

const PrimitiveInput: FC<Props> = ({ label, type, name }) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name} className="text-stone-800">
        {label}
      </label>
      <input type={type} name={name} className="p-2 w-full" />
    </div>
  );
};

export default PrimitiveInput;
