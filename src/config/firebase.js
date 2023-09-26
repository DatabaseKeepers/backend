import { config } from "dotenv";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

config();

const credential = JSON.parse(process.env.FIREBASE_CREDENTIALS);

const firebase = initializeApp(
  {
    credential: cert(credential),
  },
  "datbasekeepers-backend"
);

export const firebaseAuth = getAuth(firebase);

export default firebase;
