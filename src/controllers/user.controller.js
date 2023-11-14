import { userService } from "../services/index.js";

export async function assignRadiologist(req, res) {
  await userService.assignRadiologist(req, res);
}

export async function removeRadiologist(req, res) {
  await userService.removeRadiologist(req, res);
}

export async function images(req, res) {
  await userService.images(req, res);
}

export async function me(req, res) {
  await userService.me(req, res);
}

export async function patients(req, res) {
  await userService.patients(req, res);
}

export async function profile(req, res) {
  await userService.profile(req, res);
}

export async function updateNewEmail(req, res) {
  await userService.updateNewEmail(req, res);
}

export async function updateProfile(req, res) {
  await userService.updateProfile(req, res);
}

export async function meetOurRadiologists(req, res) {
  await userService.meetOurRadiologists(req, res);
}

export async function radiologists(req, res) {
  await userService.radiologists(req, res);
}

export async function uploadImage(req, res) {
  await userService.uploadImage(req, res);
}

export async function sendResetPassword(req, res) {
  await userService.sendResetPassword(req, res);
}
