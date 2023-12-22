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
  const mainPicFileName = images.find((img) => img.main_pic);
  const url = `${envIndex.urls.baseUrl}/services/images/${serviceId}`;
  const formData = new FormData();
  images.forEach((img) => formData.append(`images`, img));
  formData.append("service_id", serviceId.toString());
  mainPicFileName && formData.append("mainPicFileName", mainPicFileName);
  try {
    const response = await fetch(url, {
      method: method,
      body: formData,
      credentials: "include",
    });
    console.log(response, "response in upload image");
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
