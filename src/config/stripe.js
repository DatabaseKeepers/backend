import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../utils/environment.js";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export default stripe;
