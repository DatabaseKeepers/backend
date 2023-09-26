import { config } from "dotenv";
import app from "./app.js";

config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Backend listening on port ${PORT}!`));
