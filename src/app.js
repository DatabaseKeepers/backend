import cors from "cors";
import express from "express";
import { apiRouter, webhookRouter } from "./routes/index.js";
import { NODE_ENV } from "./utils/environment.js";

const WHICH_API = NODE_ENV === "production" ? "PROD" : "DEV";

const corsOptions = {
  origin:
    WHICH_API === "PROD"
      ? ["https://radiologyarchive.com", /\.radiologyarchive\.com$/]
      : ["https://dev.radiologyarchive.com", "http://localhost:5173"],
  preflightContinue: true,
};

const app = express();

app.use(cors(corsOptions));

app.use("/webhook", express.raw({ type: "*/*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);
app.use("/webhook", webhookRouter);

app.get("/", (_req, res) => {
  res.send(`You've reached RadiologyArchive's ${WHICH_API} API!`);
});

export default app;
