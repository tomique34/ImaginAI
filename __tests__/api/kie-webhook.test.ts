/** @jest-environment node */
import { POST } from "@/app/api/webhooks/kie/route";

jest.mock("@/lib/supabase/server", () => ({
  createServerClient: () => ({
    from: jest.fn(),
  }),
}));

describe("kie webhook api", () => {
  it("rejects invalid signatures", async () => {
    process.env.KIE_WEBHOOK_SECRET = "secret";

    const request = new Request("http://localhost/api/webhooks/kie", {
      method: "POST",
      headers: {
        "x-kie-signature": "invalid",
      },
      body: "payload",
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
  });
});
