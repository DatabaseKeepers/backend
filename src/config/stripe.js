import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../utils/environment.js";

const stripe = new Stripe(STRIPE_SECRET_KEY);

export default stripe;
