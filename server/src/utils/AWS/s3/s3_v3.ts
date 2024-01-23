import { Readable } from "stream";

import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";

import envIndex from "../../../env/envConfig";

const { region, accessKeyId, secretAccessKey, bucketName } = envIndex.s3.image;

const s3Client = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

export const uploadFile = async (file: any) => {
  const readableStream = Readable.from(file.buffer);

  const uploadParams = {
    Bucket: bucketName,
    Body: readableStream,
    Key: file.originalname,
  };

  const upload = new Upload({ client: s3Client, params: uploadParams });

  const uploadResult = await upload.done();

  console.log(
    uploadResult.Location,
    "location",
    uploadResult.ETag,
    "etag",
    uploadResult.Key,
    "key"
  );

  // const uploadUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURIComponent(
  //   file.originalname
  // )}`;

  return { uploadResult, url: uploadResult.Location, bucket_name: bucketName };
};

export const generateDownloadUrl = async (key: string) => {
  console.log(key, "key being looked for");
  const params = { Bucket: bucketName, Key: key, Expires: 60 };
  const getObjectCommand = new GetObjectCommand(params);

  const url = await getSignedUrl(s3Client, getObjectCommand, {
    expiresIn: 60,
  });

  return url;
};

export const deleteFile = async (key: string) => {
  const params = { Bucket: bucketName, Key: key };

  const deleteObjectCommand = new DeleteObjectCommand(params);
  const deleteResponse = await s3Client.send(deleteObjectCommand);
  return deleteResponse;
};
