import cors from "cors";
import express from "express";
import routes from "./routes/index.js";
import { NODE_ENV } from "./utils/environment.js";

const WHICH_API = NODE_ENV === "production" ? "PROD" : "DEV";

const corsOptions = {
  origin: "http://localhost:3000",
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/", (_req, res) => {
  res.send(`You've reached RadiologyArchive's ${WHICH_API} API!`);
});

export default app;
