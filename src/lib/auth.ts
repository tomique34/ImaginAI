import { createBrowserClient } from "@/lib/supabase/client";

export type AuthUser = { id: string; email: string };

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (process.env.NEXT_PUBLIC_AUTH_MODE === "mock") {
    return { id: "mock-user", email: "mock@photoreimagine.ai" };
  }

  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email ?? "",
  };
}
