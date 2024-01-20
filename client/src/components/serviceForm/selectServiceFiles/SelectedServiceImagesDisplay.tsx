import { FC, SetStateAction, useEffect, useState } from "react";
import { IFileWithPrimary } from "../../../types/serviceTypes/Service";
import { AiFillDelete } from "react-icons/ai";

type Props = {
  imageFiles: IFileWithPrimary[];
  setImages: React.Dispatch<SetStateAction<IFileWithPrimary[]>>;
};

const SelectedServiceImagesDisplay: FC<Props> = ({ imageFiles, setImages }) => {
  const [imageUrls, setImageUrls] = useState<
    { blobUrl: string; name: string; primary?: boolean }[]
  >([]);

  useEffect(() => {
    const imageUrls = imageFiles.map((image) => {
      const blob = new Blob([image], { type: image.type });
      const blobUrl = URL.createObjectURL(blob);
      return { blobUrl, name: image.name, main_pic: !!image.main_pic };
    });
    setImageUrls(imageUrls);
  }, [imageFiles]);

  const removeImage = (imgName: string) => {
    setImages((prev) => prev.filter((file) => file.name !== imgName));
  };

  const setMainPic = (imgName: string) => {
    setImages((prev) =>
      prev.map((img) => {
        img.main_pic = imgName === img.name;
        return img;
      })
    );
  };

  return (
    <div className="mb-2 flex gap-2">
      {imageUrls.map((img) => (
        <div className="flex justify-center flex-col">
          <div className="relative">
            <img
              src={img.blobUrl}
              className="w-10 h-10 object-cover cursor-pointer"
            />
            <button
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-80 text-3xl"
              onClick={() => removeImage(img.name)}
            >
              <AiFillDelete />
            </button>
          </div>
          <input
            type="radio"
            onChange={() => setMainPic(img.name)}
            className="mt-2"
            checked={img.primary}
          />
        </div>
      ))}
    </div>
  );
};

export default SelectedServiceImagesDisplay;
