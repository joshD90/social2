import dotenv from "dotenv";
dotenv.config();

export default {
  db: {
    name: process.env.DB_NAME as string,
    password: process.env.DB_PASSWORD as string,
    host: process.env.DB_HOST as string,
    username: process.env.DB_USERNAME as string,
  },
};
