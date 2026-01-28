/** @jest-environment node */
import { GET } from "@/app/api/auth/callback/route";

jest.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    auth: {
      exchangeCodeForSession: jest.fn(),
    },
  }),
}));

jest.mock("next/headers", () => ({
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
  }),
}));

describe("auth callback", () => {
  it("redirects to dashboard", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

    const request = new Request("http://localhost/api/auth/callback");
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/dashboard"
    );
  });
});
