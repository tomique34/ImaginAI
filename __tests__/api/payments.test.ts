/** @jest-environment node */
import { POST } from "@/app/api/payments/route";
import { createPolarCheckout } from "@/lib/polar";

jest.mock("@/lib/polar", () => ({
  createPolarCheckout: jest.fn(),
}));

describe("payments api", () => {
  it("returns a checkout url", async () => {
    (createPolarCheckout as jest.Mock).mockResolvedValue({
      url: "https://checkout.polar.sh/session",
    });
    const request = new Request("http://localhost/api/payments", {
      method: "POST",
      body: JSON.stringify({ productId: "prod-1" }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.checkoutUrl).toBe("https://checkout.polar.sh/session");
  });

  it("rejects missing product id", async () => {
    const request = new Request("http://localhost/api/payments", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("returns error when checkout fails", async () => {
    (createPolarCheckout as jest.Mock).mockRejectedValue(
      new Error("checkout_failed")
    );

    const request = new Request("http://localhost/api/payments", {
      method: "POST",
      body: JSON.stringify({ productId: "prod-1" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
  });
});
