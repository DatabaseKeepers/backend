import { paymentService } from "../services/index.js";

export async function bill(req, res) {
  await paymentService.bill(req, res);
}

export async function pay(req, res) {
  await paymentService.pay(req, res);
}

export async function usersInvoices(req, res) {
  await paymentService.usersInvoices(req, res);
}
