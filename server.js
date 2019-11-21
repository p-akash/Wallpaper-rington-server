import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import setupMiddware from "./middlewares";
import { authRouter } from "./authorization";
import { restRouter, apiErrorHandler } from "./api";
import { connect } from "./db";
import { requireAuth } from "./authorization/auth.middleware";

console.log("THIS IS THE ENVIRONMENT", process.env.NODE_ENV);
// Declare an app from express
const app = express();

setupMiddware(app);

require("dotenv").config();

connect();
const env = process.env.NODE_ENV || "development";

app.use(cors());

app.use("/auth", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Authorization, Accept, Access-Control-Al" +
      "low-Methods"
  );
  res.header("X-Frame-Options", "deny");
  res.header("X-Content-Type-Options", "nosniff");

  next();
});
app.use("/auth", authRouter);
app.use("/uploads", express.static("uploads"));
app.use("/api", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Authorization, Accept, Access-Control-Al" +
      "low-Methods"
  );
  res.header("X-Frame-Options", "deny");
  res.header("X-Content-Type-Options", "nosniff");
  next();
});
app.use("/api", restRouter);
app.use(apiErrorHandler);

const appRoot = fs.realpathSync(process.cwd());

if (env === "production") {
  console.log("The root of the application is", appRoot);
  const clientPath = path.resolve(appRoot, "build/client");
  const indexPath = path.join(clientPath, "index.html");
  console.log(clientPath);
  console.log(indexPath);

  app.use(express.static(clientPath));
  app.get("/*", (req, res) => {
    res.sendFile(indexPath);
  });
}

export default app;
