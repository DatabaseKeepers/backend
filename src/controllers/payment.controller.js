import { paymentService } from "../services/index.js";

export async function pay(req, res) {
  await paymentService.pay(req, res);
}

