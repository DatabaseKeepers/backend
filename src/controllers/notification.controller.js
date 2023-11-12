import { notificationService } from "../services/index.js";

export async function polling(req, res) {
  await notificationService.polling(req, res);
}

export async function read(req, res) {
  await notificationService.read(req, res);
}
