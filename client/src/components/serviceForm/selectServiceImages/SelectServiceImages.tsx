import { FC, SetStateAction } from "react";
import { AiFillPlusCircle } from "react-icons/ai";

type Props = {
  images: File[];
  setImages: React.Dispatch<SetStateAction<File[]>>;
  uploadImages: () => void;
};

const SelectServiceImages: FC<Props> = ({
  images,
  setImages,
  uploadImages,
}) => {
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

  const handleImageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    uploadImages();
  };

  return (
    <div className="text-white flex">
      <form action="" onSubmit={handleImageSubmit} className="flex">
        <div>
          <label htmlFor="images"></label>
          <input type="file" id="images" multiple onChange={updateImages} />
        </div>
        <button type="submit">
          <AiFillPlusCircle />
        </button>
      </form>
      <div>
        {images.map((image) => (
          <img src={""} />
        ))}
      </div>
    </div>
  );
};

export default SelectServiceImages;
