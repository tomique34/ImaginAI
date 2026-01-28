import { verifyWebhook } from "@/lib/webhook";

describe("webhook", () => {
  it("rejects invalid signatures", () => {
    process.env.KIE_WEBHOOK_SECRET = "secret";
    expect(verifyWebhook("bad", "payload")).toBe(false);
  });
});
