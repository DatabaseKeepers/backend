import cors from "cors";
import { config } from "dotenv";
import express from "express";
import routes from "./routes/index.js";

config();

const corsOptions = {
  origin: "http://localhost:3000",
};

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.listen(PORT, () => console.log(`Backend listening on port ${PORT}!`));
