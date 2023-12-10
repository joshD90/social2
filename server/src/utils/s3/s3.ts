import aws from "aws-sdk";

const region = "eu-west-1";
const bucketName = "my-first-bucket-with-aws";
const accessKeyId = process.env.S3_ACCESS_KEY_ID_2;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY_2;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

export const generateUploadURL = async () => {
  const imageName = crypto.randomUUID();
  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
    ContentType: "multipart/form-data",
  };
  const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
  return uploadUrl;
};

export const generateDownloadUrl = async (key: string) => {
  const params = { Bucket: bucketName, Key: key, Expires: 60 };

  const downloadUrl = await s3.getSignedUrlPromise("getObject", params);
  return downloadUrl;
};
