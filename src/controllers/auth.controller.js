import { authService } from "../services/index.js";

export async function signup(req, res) {
  await authService.signup(req, res);
}
