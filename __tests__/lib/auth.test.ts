import { createBrowserClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/auth";

jest.mock("@/lib/supabase/client", () => ({
  createBrowserClient: jest.fn(),
}));

describe("auth", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_AUTH_MODE;
    jest.clearAllMocks();
  });

  it("returns mock user in mock mode", async () => {
    process.env.NEXT_PUBLIC_AUTH_MODE = "mock";
    const user = await getCurrentUser();
    expect(user?.id).toBe("mock-user");
  });

  it("returns null when no supabase user", async () => {
    process.env.NEXT_PUBLIC_AUTH_MODE = "supabase";
    (createBrowserClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: async () => ({ data: { user: null } }),
      },
    });

    const user = await getCurrentUser();

    expect(user).toBeNull();
  });

  it("returns supabase user when available", async () => {
    process.env.NEXT_PUBLIC_AUTH_MODE = "supabase";
    (createBrowserClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: async () => ({
          data: { user: { id: "u1", email: "user@example.com" } },
        }),
      },
    });

    const user = await getCurrentUser();

    expect(user?.id).toBe("u1");
    expect(user?.email).toBe("user@example.com");
  });
});
