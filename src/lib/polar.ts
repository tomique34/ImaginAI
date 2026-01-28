type CheckoutInput = {
  productId: string;
  successUrl: string;
  returnUrl: string;
  customerEmail?: string;
};

export function buildCheckoutRequest(input: CheckoutInput) {
  return {
    products: [input.productId],
    success_url: input.successUrl,
    return_url: input.returnUrl,
    customer_email: input.customerEmail,
  };
}

export async function createPolarCheckout(input: CheckoutInput) {
  const apiKey = process.env.POLAR_SECRET_KEY;
  if (!apiKey) {
    throw new Error("POLAR_SECRET_KEY_MISSING");
  }

  const baseUrl = process.env.POLAR_API_BASE_URL || "https://api.polar.sh";
  const response = await fetch(`${baseUrl}/v1/checkouts/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildCheckoutRequest(input)),
  });

  if (!response.ok) {
    throw new Error("POLAR_CHECKOUT_FAILED");
  }

  return response.json();
}
