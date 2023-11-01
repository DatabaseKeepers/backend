import { imageService } from "../services/index.js";

export async function updateImageNote(req, res) {
  await imageService.updateImageNote(req, res);
}
