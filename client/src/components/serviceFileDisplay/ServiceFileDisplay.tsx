import { FC, useState } from "react";
import { IServiceFileDBEntry } from "../../types/serviceTypes/Service";

import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";
import { twThemeColors } from "../../assets/themeColors/twThemeColors";
import envIndex from "../../envIndex/envIndex";
import downloadBlob from "../../utils/downloadBlob/downloadBlob";

type Props = { files: IServiceFileDBEntry[]; themeColor: ThemeColor };

const ServiceFileDisplay: FC<Props> = ({ files, themeColor }) => {
  const [error, setError] = useState("");

  const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fileDetails = JSON.parse(e.target.value);
    const { id, fileName } = fileDetails;
    if (!id || !fileName) return setError("Incorrect file id or filename");

    const url = `${envIndex.urls.baseUrl}/services/files/signed/${id}`;

    if (!url) return setError("There was no url selected");
    try {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok)
        return setError(
          "Could fetch the signed url from db with response text of " +
            response.statusText
        );

      const signedUrl = await response.json();
      const s3Response = await fetch(signedUrl);
      if (!s3Response.ok)
        return setError(
          "Could not fetch file from S3 bucket " + s3Response.statusText
        );
      const blob = await s3Response.blob();
      downloadBlob(blob, fileName);
    } catch (error) {
      console.log(error, "error in getting signed url");
      setError((error as Error).message);
    }
  };

  return (
    <div
      className={`${twThemeColors.border[themeColor]} border-2 text-stone-900 h-fit`}
    >
      {error !== "" && <p>{error}</p>}
      <p className="w-full p-2 bg-stone-400">
        Select Associated File to Download
      </p>
      <select
        className="w-full p-2"
        onChange={(e) => handleSelect(e)}
        defaultValue={"Select File"}
      >
        <option disabled value={"Select File"}>
          Select File
        </option>
        {files.map((file) => (
          <option
            className="w-full flex"
            value={JSON.stringify({ id: file.id, fileName: file.fileName })}
            key={file.id}
          >
            {file.fileName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ServiceFileDisplay;
