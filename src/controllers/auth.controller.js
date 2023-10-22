import { authService } from "../services/index.js";

export async function addPatient(req, res) {
  await authService.addPatient(req, res);
}

export async function login(req, res) {
  await authService.login(req, res);
}

export async function signup(req, res) {
  await authService.signup(req, res);
}

export async function token(_req, res) {
  res.json({ msg: "You are authenticated" });
}
