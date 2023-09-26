import { firebaseAuth } from "../config/firebase.js";

const getAuthToken = (req, _res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  }
  next();
};

export const isAuthenticated = (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const userInfo = await firebaseAuth.verifyIdToken(req.authToken);
      if (userInfo.uid) {
        req.userUID = userInfo.uid;
        return next();
      }
    } catch (error) {
      console.log(error.code, error.message);
      return res
        .status(401)
        .send({ error: "You are not authorized to make this request" });
    }
  });
};
