import { SetStateAction } from "react";
import envIndex from "../../../envIndex/envIndex";
import isError from "../../../utils/isError/isError";

const uploadImages = async (
  images: File[],
  updateField: <T>(name: string, value: T[]) => void,
  setInputErrors: React.Dispatch<SetStateAction<{ [key: string]: string }>>
) => {
  const url = `${envIndex.urls.baseUrl}/services/images`;
  const formData = new FormData();
  images.forEach((img) => formData.append(`images`, img));
  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if (!response.ok)
      throw Error(response.statusText + " for uploading Images");
    const data = await response.json();
    const imgUrls = data.images as string[];
    updateField("images", imgUrls);
  } catch (error) {
    if (isError(error))
      setInputErrors((prev) => ({ ...prev, images: (error as Error).message }));
  }
};

export default uploadImages;
