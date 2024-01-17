import { useState } from "react";
import FileIcon from "./FileIcon";
import { AiFillDelete } from "react-icons/ai";

const SelectServiceFiles = () => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="text-white">
      <h4>Upload Files Associated With This Service</h4>
      <div className="flex gap-2">
        {files.map((file) => (
          <div className="relative">
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <AiFillDelete />
            </p>
            <FileIcon file={file} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectServiceFiles;
