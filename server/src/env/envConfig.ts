import dotenv from "dotenv";
dotenv.config();

export default {
  db: {
    name: process.env.DB_NAME as string,
    password: process.env.DB_PASSWORD as string,
    host: process.env.DB_HOST as string,
    username: process.env.DB_USERNAME as string,
  },
  server: {
    port: process.env.PORT as string,
    clientServer: process.env.CLIENT_SERVER as string,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET as string,
  },
};
