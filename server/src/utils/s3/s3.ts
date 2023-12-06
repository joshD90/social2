import aws from "aws-sdk";

const region = "eu-west-1";
const bucketName = "my-first-bucket-with-aws";
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

console.log();
const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

export const generateUploadURL = async () => {
  const imageName = crypto.randomUUID();
  const params = { Bucket: bucketName, Key: imageName, Expires: 60 };

  const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
  return uploadUrl;
};
