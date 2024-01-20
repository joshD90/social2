import { FC, SetStateAction } from "react";
import { findIconsOnExtensions } from "./fileIconImages";
import { AiFillDelete } from "react-icons/ai";

type Props = {
  files: File[];
  setFiles: React.Dispatch<SetStateAction<File[]>>;
};

const FileIconsDisplay: FC<Props> = ({ files, setFiles }) => {
  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  };
  return (
    <div className="w-full flex gap-2 flex-wrap">
      {files.map((file) => (
        <div className="">
          <div className="relative flex items-center justify-center">
            <div className="text-2xl">{findIconsOnExtensions(file)}</div>
            <span
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 text-xl text-red-400 cursor-pointer"
              onClick={() => removeFile(file.name)}
            >
              <AiFillDelete />
            </span>
          </div>
          <p>{file.name.slice(0, 20)}</p>
        </div>
      ))}
    </div>
  );
};

export default FileIconsDisplay;
