import { config } from "dotenv";

config();

export const DATABASE_URL = process.env.DATABASE_URL;
export const FIREBASE_CREDENTIALS = process.env.FIREBASE_CREDENTIALS;
export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
