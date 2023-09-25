import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFile } from "fs/promises";

const credential = JSON.parse(await readFile("./src/config/firebaseCredentials.json"));

const firebase = initializeApp(
  {
    credential: cert(credential),
  },
  "datbasekeepers-backend"
);

export const firebaseAuth = getAuth(firebase);

export default firebase;
