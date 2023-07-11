import express from "express";
import cors from "cors";
require("dotenv").config();

import Database from "./db/Database";
import envConfig from "./env/envConfig";

import serviceRouter from "./routes/serviceRoutes";
import categoryRouter from "./routes/categoryRoutes";
//configure server app
const app = express();

app.use(cors({ origin: envConfig.server.clientServer, credentials: true }));
app.use(express.json());

export const db = new Database();

app.use("/service", serviceRouter);
app.use("/categories", categoryRouter);

app.listen(envConfig.server.port, () =>
  console.log(`Server is listening on ${envConfig.server.port}`)
);
