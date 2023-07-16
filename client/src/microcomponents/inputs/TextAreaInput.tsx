import { FC } from "react";

type Props = {
  label: string;
  size: { cols: number; rows: number };
  name: string;
  value: string;
  updateField: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const TextAreaInput: FC<Props> = ({
  label,
  size,
  name,
  updateField,
  value,
}) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name} className="text-stone-800">
        {label}
      </label>
      <textarea
        cols={size.cols}
        rows={size.rows}
        name={name}
        className="p-2 w-full rounded-sm"
        onChange={(e) => updateField(e)}
        value={value}
      ></textarea>
    </div>
  );
};

export default TextAreaInput;
