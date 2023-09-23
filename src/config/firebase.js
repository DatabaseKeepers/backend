import admin from "firebase-admin";
import credential from "./firebaseAccount.json";

admin.initializeApp({
  credential,
});
