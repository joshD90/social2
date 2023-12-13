import { SetStateAction } from "react";
import envIndex from "../../../envIndex/envIndex";
import isError from "../../../utils/isError/isError";

const uploadImages = async (
  images: File[],
  serviceId: number,
  setInputErrors: React.Dispatch<SetStateAction<{ [key: string]: string }>>,
  method: "PUT" | "POST"
) => {
  const url = `${envIndex.urls.baseUrl}/services/images`;
  const formData = new FormData();
  images.forEach((img) => formData.append(`images`, img));
  formData.append("service_id", serviceId.toString());
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
