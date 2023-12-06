import aws from "aws-sdk";

const s3 = new aws.s3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion,
});
