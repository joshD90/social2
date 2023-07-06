import express from "express";
import cors from "cors";
require("dotenv").config();

import { Request, Response } from "express";

import Database from "./db/Database";
import envConfig from "./env/envConfig";

import serviceRouter from "./routes/serviceRoutes";

const app = express();

export const db = new Database();

app.use("/service", serviceRouter);

app.listen(envConfig.server.port, () =>
  console.log(`Server is listening on ${envConfig.server.port}`)
);
