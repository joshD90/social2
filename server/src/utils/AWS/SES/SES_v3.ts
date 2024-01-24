import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

import envIndex from "../../../env/envConfig";

const { region, accessKeyId, secretAccessKey } = envIndex.s3.image;

const sesClient = new SESClient({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

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
  const sendEmailCommand = new SendEmailCommand(params);

  const sentEmail = await sesClient.send(sendEmailCommand);
  return sentEmail;
};

const createPasswordResetEmail = (email: string, token: string) => {
  const url = `${envIndex.frontend.baseUrl}/auth/passwordReset?username=${email}&token=${token}`;

  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Data: `This email was sent to reset your password.  If you did not expect this please ignore.  Click here to follow through to the password reset page ${url}`,
        },
      },
      Subject: {
        Data: "Reset your Social2 Password",
      },
    },
    Source: "joshuadancey@hotmail.com",
  };
  return params;
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const params = createPasswordResetEmail(email, token);
  const sendEmailCommand = new SendEmailCommand(params);

  const sentEmail = await sesClient.send(sendEmailCommand);
  return sentEmail;
};
