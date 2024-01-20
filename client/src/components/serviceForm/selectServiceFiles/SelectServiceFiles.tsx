import { FC, SetStateAction } from "react";

import { IFileWithPrimary } from "../../../types/serviceTypes/Service";

type Props = {
  files: IFileWithPrimary[] | File[];
  setFiles: React.Dispatch<SetStateAction<IFileWithPrimary[]>>;
  fileDisplay: React.ReactNode;
  forImage: boolean;
};

const SelectServiceFiles: FC<Props> = ({
  files,
  setFiles,
  forImage,
  fileDisplay,
}) => {
  const updateImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    //only have images that are of the right MIME type (image)
    const selectedFiles = [...fileList];
    if (forImage) {
      const filteredImages = selectedFiles.filter(
        (file) => file.type.split("/")[0] === "image"
      );
      setFiles([...files, ...filteredImages]);
    } else {
      setFiles([...files, ...selectedFiles]);
    }
  };

  return (
    <div className="text-white">
      {forImage ? (
        <h4 className="mb-2">Upload Images of Service</h4>
      ) : (
        <h4 className="mb-2">Upload Files to Service</h4>
      )}

      {fileDisplay}

      <form action="" className="flex">
        <div className="h-12 w-full relative">
          <label
            htmlFor="images"
            className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-800 text-center text-xl"
          >
            <span>Select {forImage ? "Images" : "Files"}</span>
          </label>
          <input
            type="file"
            id="images"
            multiple
            onChange={updateImages}
            className="opacity-0 w-full h-full absolute top-0 left-0 cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default SelectServiceFiles;
