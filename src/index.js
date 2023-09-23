import { connect } from "@planetscale/database";
import cors from "cors";
import { config } from "dotenv";
import express from "express";

config();

const corsOptions = {
  origin: "http://localhost:3000",
};

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => res.send("Hello World!"));

app.listen(PORT, () => console.log(`Backend listening on port ${PORT}!`));

const sqlConfig = {
  url: process.env.DATABASE_URL
};

const conn = connect(sqlConfig);
const results = await conn.execute(
  "SELECT unique_id,username,email,dob FROM Patient"
);
console.log(`Returned length should be 4 : ${results.fields.length}`);
