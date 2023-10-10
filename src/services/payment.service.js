export async function pay(req, res) {
  return res.status(200).json({ message: "Payment success for:" + req.userUID });
}
