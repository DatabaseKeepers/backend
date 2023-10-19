import { userService } from "../services/index.js";

export async function me(req, res) {
  await userService.me(req, res);
}

export async function patients(req, res) {
  await userService.patients(req, res);
}

export async function profile(req, res) {
  await userService.profile(req, res);
}

export async function uploadImage(req, res) {
  await userService.uploadImage(req, res);
}
