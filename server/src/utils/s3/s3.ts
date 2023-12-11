import fs from "fs";
import aws from "aws-sdk";

import envIndex from "../../env/envConfig";

const { region, accessKeyId, secretAccessKey, bucketName } = envIndex.s3.image;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

//upload through the server
export const uploadFile = (file: any) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  const uploadResult = s3.upload(uploadParams).promise();

  return uploadResult;
};

//use signed url to fetch from frontend
export const generateDownloadUrl = async (key: string) => {
  const params = { Bucket: bucketName, Key: key, Expires: 60 };

  const downloadUrl = await s3.getSignedUrlPromise("getObject", params);
  return downloadUrl;
};

// export const generateUploadURL = async () => {
//   const imageName = crypto.randomUUID();
//   const params = {
//     Bucket: bucketName,
//     Key: imageName,
//     Expires: 60,
//     ContentType: "multipart/form-data",
//   };
//   const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
//   return uploadUrl;
// };
