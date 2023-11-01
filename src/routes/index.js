import express from "express";
import authRoutes from "./auth.route.js";
import hospitalRoutes from "./hospital.route.js";
import imageRoutes from "./image.route.js";
import paymentRoutes from "./payment.route.js";
import userRoutes from "./user.route.js";
import stripeRoutes from "./stripe.route.js";

const apiRouter = express.Router();
const webhookRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/hospital", hospitalRoutes);
apiRouter.use("/image", imageRoutes);
apiRouter.use("/payment", paymentRoutes);
apiRouter.use("/user", userRoutes);

webhookRouter.use(stripeRoutes);

export { apiRouter, webhookRouter };
