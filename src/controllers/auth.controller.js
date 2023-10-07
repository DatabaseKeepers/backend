import { authService } from "../services/index.js";

export async function login(req, res) {
  await authService.login(req, res);
}

export async function signup(req, res) {
  await authService.signup(req, res);
}

export async function token(_req, res) {
  res.json({ message: "You are authenticated" });
}
