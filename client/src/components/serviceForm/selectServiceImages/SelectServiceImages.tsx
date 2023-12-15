import { FC, SetStateAction, useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { IFileWithPrimary } from "../../../types/serviceTypes/Service";

type Props = {
  images: IFileWithPrimary[];
  setImages: React.Dispatch<SetStateAction<IFileWithPrimary[]>>;
};

const SelectServiceImages: FC<Props> = ({ images, setImages }) => {
  const [imageUrls, setImageUrls] = useState<
    { blobUrl: string; name: string; primary?: boolean }[]
  >([]);

  const updateImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    //only have images that are of the right MIME type (image)
    const selectedImages = [...fileList];
    const filteredImages = selectedImages.filter(
      (img) => img.type.split("/")[0] === "image"
    );
    setImages([...images, ...filteredImages]);
  };

  useEffect(() => {
    const imageUrls = images.map((image) => {
      const blob = new Blob([image], { type: image.type });
      const blobUrl = URL.createObjectURL(blob);
      return { blobUrl, name: image.name, primary: !!image.primary };
    });
    setImageUrls(imageUrls);
  }, [images]);

  const removeImage = (imgName: string) => {
    setImages((prev) => prev.filter((file) => file.name !== imgName));
  };

  const setPriority = (imgName: string) => {
    setImages((prev) =>
      prev.map((img) => {
        img.primary = imgName === img.name;
        return img;
      })
    );
  };

  return (
    <div className="text-white">
      <h4>Upload Images of Service</h4>
      <div className="mb-2 flex gap-2">
        {imageUrls.map((img) => (
          <div className="relative flex justify-center flex-col">
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
            <input
              type="radio"
              onChange={() => setPriority(img.name)}
              className="mt-2"
              checked={img.primary}
            />
          </div>
        ))}
      </div>
      <form action="" className="flex">
        <div className="h-12 w-full relative">
          <label
            htmlFor="images"
            className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-800 text-center text-xl"
          >
            <span>Select Image</span>
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

export default SelectServiceImages;
