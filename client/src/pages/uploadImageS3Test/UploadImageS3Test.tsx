import { useEffect, useState } from "react";
import envIndex from "../../envIndex/envIndex";

const UploadImageS3Test = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>();
  const [imageSrc1, setImageSrc1] = useState("");

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
      console.log(uploadResponse, "secondary upload response");
      if (!uploadResponse.ok) throw Error(uploadResponse.statusText);
      const uploadResult = await uploadResponse.text();
      console.log(
        uploadResult,
        "this is the response  data that has come back from AWS"
      );
      const imageUrl = uploadResult.split("?")[0];
      console.log(imageUrl, "final image url");

      //once saved to s3 post request to my server to get any extra data
    } catch (error) {
      console.log(error);
    }
  };

  const handleServerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const response = await fetch(`${envIndex.urls.baseUrl}/images`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw Error(response.statusText);
      const data = await response.json();
      console.log(data, "data in handleServer Submit");
    } catch (error) {
      console.log(error, "error for Server Submit");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${envIndex.urls.baseUrl}/images/public/f0d50149-8627-4061-9f0a-c6dab8ef040c`
        );

        if (!response.ok) throw Error(response.statusText);
        const getUrl = await response.json();
        console.log(getUrl);
        setImageSrc1(getUrl);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-stone-800 text-white">
      <img src={imageSrc1} alt="Should  be a pic" />
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
