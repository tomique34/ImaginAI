import crypto from "crypto";

export function verifyWebhook(signature: string, payload: string) {
  const secret = process.env.KIE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("KIE_WEBHOOK_SECRET_MISSING");
  }

  const hash = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return hash === signature;
}
