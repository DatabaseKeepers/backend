import { hospitalService } from "../services/index.js";

export async function hospitals(req, res) {
  await hospitalService.hospitals(req, res);
}
