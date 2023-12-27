import { Readable } from "stream";
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
  const readableStream = Readable.from(file.buffer);

  const uploadParams = {
    Bucket: bucketName,
    Body: readableStream,
    Key: file.originalname,
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

export const deleteImage = async (key: string) => {
  const params = { Bucket: bucketName, Key: key };

  const deleteResponse = await s3.deleteObject(params).promise();

  return deleteResponse;
};
