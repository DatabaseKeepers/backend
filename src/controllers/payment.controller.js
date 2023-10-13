import { paymentService } from "../services/index.js";

export async function invoices(req, res) {
  await paymentService.invoices(req, res);
}

export async function invoice(req, res) {
  await paymentService.invoice(req, res);
}

export async function pay(req, res) {
  await paymentService.pay(req, res);
}
