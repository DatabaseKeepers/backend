import { cert, initializeApp } from "firebase-admin/app";
import credential from "./firebaseCredentials.json" assert { type: "json" };

const firebase = initializeApp({
  credential: cert(credential),
}, "datbasekeepers-backend");

export default firebase;
