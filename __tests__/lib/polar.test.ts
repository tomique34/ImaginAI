import { buildCheckoutRequest } from "@/lib/polar";

describe("polar", () => {
  it("builds checkout request", () => {
    const payload = buildCheckoutRequest({
      productId: "prod-1",
      successUrl: "https://example.com/success",
      returnUrl: "https://example.com/return",
    });

    expect(payload.products).toEqual(["prod-1"]);
    expect(payload.success_url).toBe("https://example.com/success");
    expect(payload.return_url).toBe("https://example.com/return");
  });
});
