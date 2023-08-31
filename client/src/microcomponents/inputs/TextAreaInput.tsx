import { FC, SetStateAction } from "react";

type Props = {
  label: string;
  size: { cols: number; rows: number };
  name: string;
  value: string;
  updateField: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  gridSpan?: number;
  inputError?: { [key: string]: string };
  setInputError?: React.Dispatch<SetStateAction<{ [key: string]: string }>>;
};

const TextAreaInput: FC<Props> = ({
  label,
  size,
  name,
  updateField,
  value,
  gridSpan,
  inputError,
  setInputError,
}) => {
  const generateGridSpan = () => `col-span-${gridSpan || 1}`;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateField(e);
    setInputError &&
      setInputError((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  return (
    <div className={`flex flex-col w-full ${generateGridSpan()}`}>
      <label htmlFor={name} className="text-stone-50">
        {label}
      </label>
      <textarea
        cols={size.cols}
        rows={size.rows}
        name={name}
        className="p-2 w-full rounded-sm"
        onChange={handleChange}
        value={value ? value : ""}
      ></textarea>
      {inputError && inputError[name] && (
        <p className="text-red-400">{inputError[name]}</p>
      )}
    </div>
  );
};

export default TextAreaInput;
