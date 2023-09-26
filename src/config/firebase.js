import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FIREBASE_CREDENTIALS } from "../utils/environment.js";

const credential = JSON.parse(FIREBASE_CREDENTIALS);

const firebase = initializeApp(
  {
    credential: cert(credential),
  },
  "datbasekeepers-backend"
);

export const firebaseAuth = getAuth(firebase);

export default firebase;
