import { SetStateAction } from "react";
import envIndex from "../../../envIndex/envIndex";
import isError from "../../../utils/isError/isError";
import { IFileWithPrimary } from "../../../types/serviceTypes/Service";

const uploadImages = async (
  images: IFileWithPrimary[],
  serviceId: number,
  setInputErrors: React.Dispatch<SetStateAction<{ [key: string]: string }>>,
  method: "PUT" | "POST"
) => {
  const mainPicIndex = images.findIndex((img) => img.main_pic);
  const url = `${envIndex.urls.baseUrl}/services/images/${serviceId}`;
  const formData = new FormData();
  images.forEach((img) => formData.append(`images`, img));
  formData.append("service_id", serviceId.toString());
  mainPicIndex && formData.append("mainPicIndex", mainPicIndex.toString());
  console.log(method);
  try {
    const response = await fetch(url, {
      method: method,
      body: formData,
      credentials: "include",
    });
    console.log(response);
    if (!response.ok)
      throw Error(response.statusText + " for uploading Images");

    return true;
  } catch (error) {
    if (isError(error)) console.log(error);
    // setInputErrors((prev) => ({ ...prev, images: (error as Error).message }));
    return false;
  }
};

export default uploadImages;
