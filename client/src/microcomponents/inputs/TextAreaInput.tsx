import { FC } from "react";

type Props = {
  label: string;
  size: { cols: number; rows: number };
  name: string;
  value: string;
  updateField: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  gridSpan?: number;
};

const TextAreaInput: FC<Props> = ({
  label,
  size,
  name,
  updateField,
  value,
  gridSpan,
}) => {
  const generateGridSpan = () => `col-span-${gridSpan || 1}`;
  return (
    <div className={`flex flex-col w-full ${generateGridSpan()}`}>
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
