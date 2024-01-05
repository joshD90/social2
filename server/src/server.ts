import express from "express";
import cors from "cors";
require("dotenv").config();
import cookieParser from "cookie-parser";

import Database from "./db/Database/Database";
import envConfig from "./env/envConfig";

import serviceRouter from "./routes/serviceRoutes";
import categoryRouter from "./routes/categoryRoutes";
import authRouter from "./routes/authRoutes";
import searchRouter from "./routes/searchRoutes";
import userRouter from "./routes/userRoutes";
import imageRouter from "./routes/imageRoutes";

import { configurePassport } from "./utils/passport-strategies";
//configure server app
const app = express();

app.use(cors({ origin: envConfig.server.clientServer, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

export const db = new Database();

configurePassport(app);
app.use("/images", imageRouter);
app.use("/services", serviceRouter);
app.use("/categories", categoryRouter);
app.use("/auth", authRouter);
app.use("/search", searchRouter);
app.use("/users", userRouter);

app.listen(envConfig.server.port, () =>
  console.log(`Server is listening on ${envConfig.server.port}`)
);
