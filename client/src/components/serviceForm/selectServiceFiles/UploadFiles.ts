import { SetStateAction } from "react";
import envIndex from "../../../envIndex/envIndex";
import isError from "../../../utils/isError/isError";
import { IFileWithPrimary } from "../../../types/serviceTypes/Service";

function uploadImages(
  files: IFileWithPrimary[],
  serviceId: number,
  setInputErrors: React.Dispatch<SetStateAction<{ [key: string]: string }>>,
  forImg: true,
  method: "PUT" | "POST"
): Promise<boolean>;

function uploadImages(
  files: File[],
  serviceId: number,
  setInputErrors: React.Dispatch<SetStateAction<{ [key: string]: string }>>,
  forImg: false,
  method: "PUT" | "POST"
): Promise<boolean>;

async function uploadImages(
  files: IFileWithPrimary[] | File[],
  serviceId: number,
  setInputErrors: React.Dispatch<SetStateAction<{ [key: string]: string }>>,
  forImg: boolean,
  method: "PUT" | "POST"
) {
  const formData = new FormData();
  let url: string;
  if (forImg) {
    const mainPicIndex = files.findIndex(
      (file) => (file as IFileWithPrimary).main_pic
    );
    url = `${envIndex.urls.baseUrl}/services/images/${serviceId}`;

    files.forEach((file) => formData.append(`images`, file));
    formData.append("service_id", serviceId.toString());
    mainPicIndex && formData.append("mainPicIndex", mainPicIndex.toString());
  } else {
    url = `${envIndex.urls.baseUrl}/services/files`;
    files.forEach((file) => formData.append("files", file));
    formData.append("serviceId", serviceId.toString());
  }

  try {
    const response = await fetch(url, {
      method: method,
      body: formData,
      credentials: "include",
    });
    console.log(response, "response in uploadFiles function");
    if (!response.ok)
      throw Error(
        response.statusText + " for uploading files" + "of type" + forImg
          ? "image"
          : "file"
      );

    return true;
  } catch (error) {
    console.log(error, "error in upload files response");
    if (isError(error)) console.log(error);
    // setInputErrors((prev) => ({ ...prev, images: (error as Error).message }));
    return false;
  }
}

export default uploadImages;
