import { userService } from "../services/index.js";

export async function me(req, res) {
  await userService.me(req, res);
}

export async function patients(req, res) {
  await userService.patients(req, res);
}
