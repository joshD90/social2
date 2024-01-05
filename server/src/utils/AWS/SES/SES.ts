import { PromiseResult } from "aws-sdk/lib/request";

import envIndex from "../../../env/envConfig";

import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: envIndex.s3.image.accessKeyId,
  secretAccessKey: envIndex.s3.image.secretAccessKey,
  region: envIndex.s3.image.region,
});

const SES = new AWS.SES({ apiVersion: "2010-12-01" });

const createConfirmEmailParams = (destination: string, magicKey: string) => {
  const url = `${envIndex.frontend.baseUrl}/auth/mailconfirm?username=${destination}&magickey=${magicKey}`;

  const params = {
    Destination: {
      ToAddresses: [destination],
    },
    Message: {
      Body: {
        Text: {
          Data: `This email was used to sign up for an account at social2 the Social Carers Website.  If this was not you please ignore this email.  If this was you please click on the below link to be confirm your email address. ${url}`,
        },
      },
      Subject: {
        Data: "Confirm Your Email With Social2",
      },
    },
    Source: "joshuadancey@hotmail.com",
  };
  return params;
};

export const sendConfirmMail = async (email: string, magicKey: string) => {
  const params = createConfirmEmailParams(email, magicKey);
  const sentEmail = await SES.sendEmail(params).promise();
  return sentEmail;
};
