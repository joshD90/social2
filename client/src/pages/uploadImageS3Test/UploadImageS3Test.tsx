import { useState } from "react";

const UploadImageS3Test = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>();

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(selectedFile, "selected file");

    //get a secure url from our server

    //post the image directly to s3 bucket

    //once saved to s3 post request to my server to get any extra data
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
