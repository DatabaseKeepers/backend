import { notificationService } from "../services/index.js";

export async function polling(req, res) {
  await notificationService.polling(req, res);
}
