import { paymentService } from "../services/index.js";

export async function invoices(req, res) {
  await paymentService.invoices(req, res);
}

export async function invoice(req, res) {
  await paymentService.invoice(req, res);
}

export async function voidInvoice(req, res) {
  await paymentService.voidInvoice(req, res);
}
