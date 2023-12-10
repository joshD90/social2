import aws from "aws-sdk";
import fs from "fs";

const region = process.env.S3_SERVER_BUCKET_REGION!;
const bucketName = process.env.S3_SERVER_BUCKET_NAME!;
const accessId = process.env.S3_SERVER_BUCKET_ACCESS_ID!;
const accessSecret = process.env.S3_SERVER_BUCKET_ACCESS_SECRET!;

const s3 = new aws.S3({
  region,
  accessKeyId: accessId,
  secretAccessKey: accessSecret,
});

const uploadFile = (file: any) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  const uploadResult = s3.upload(uploadParams).promise();

  return uploadResult;
};

export { uploadFile };
