import { PromiseResult } from "aws-sdk/lib/request";

import envIndex from "../../../env/envConfig";

import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: envIndex.s3.image.accessKeyId,
  secretAccessKey: envIndex.s3.image.secretAccessKey,
  region: envIndex.s3.image.region,
});

const SES = new AWS.SES({ apiVersion: "2010-12-01" });

const params = {
  Destination: {
    ToAddresses: ["joshuadancey48@gmail.com"],
  },
  Message: {
    Body: {
      Text: {
        Data: "This is my first email",
      },
    },
    Subject: {
      Data: "Your first email from your social2",
    },
  },
  Source: "joshuadancey@hotmail.com",
};

export const sendMail = async () => {
  try {
    const sentEmail = await SES.sendEmail(params).promise();
    console.log(sentEmail, "sent email from SES");
    return sentEmail;
  } catch (error) {
    console.log(error, "error in sendMail");
    throw error;
  }
};
