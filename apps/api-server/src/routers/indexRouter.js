import express from "express";

import path from "path";
import process from "process";
// Define __dirname equivalent for ESM compatibility
const __dirname = process.cwd();


const indexRouter = express.Router();

indexRouter.get("/", (req, res) => {
  res.status(200).sendFile("index.html");
});


export default indexRouter;