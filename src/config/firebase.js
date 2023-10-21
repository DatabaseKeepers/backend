import { cert, initializeApp as initializeAdminApp } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  FIREBASE_ADMIN_CREDENTIALS,
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from "../utils/environment.js";

// Firebase Admin SDK
const credential = JSON.parse(FIREBASE_ADMIN_CREDENTIALS);

const firebaseAdmin = initializeAdminApp(
  {
    credential: cert(credential),
  },
  "radiologyarchive-firebase-admin"
);

const adminAuth = getAdminAuth(firebaseAdmin);

// Firebase SDK
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

const firebase = initializeApp(firebaseConfig, "radiologyarchive-firebase");

const auth = getAuth(firebase);

export {
  adminAuth,
  auth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
};

export default firebase;
