import { useState } from "react";
import envIndex from "../../envIndex/envIndex";

const UploadImageS3Test = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>();

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(selectedFile, "selected file");
    if (!selectedFile) return;
    //get a secure url from our server
    try {
      const response = await fetch(`${envIndex.urls.baseUrl}/images/s3url`);
      if (!response.ok) throw Error(JSON.stringify(response));
      const uploadUrl = await response.text();
      console.log(uploadUrl, "uploadurl");

      //post the image directly to s3 bucket
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "multipart/form-data" },
        body: selectedFile,
      });
      if (!uploadResponse.ok) throw Error(uploadResponse.statusText);
      const uploadResult = await uploadResponse.json();
      const imageUrl = uploadResult.split("?")[0];
      console.log(imageUrl, "final image url");

      //once saved to s3 post request to my server to get any extra data
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-stone-800 text-white">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="">Upload Select Image</label>
          <input type="file" onChange={handleSelectFile} />
          <button type="submit">Upload</button>
        </div>
      </form>
    </div>
  );
};

export default UploadImageS3Test;
