import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function createSupabaseRouteClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_ENV_MISSING");
  }

  const cookieStore = cookies();

  return createServerClient(url, key, {
    cookies: {
      get: (name) => cookieStore.get(name)?.value,
      set: (name, value, options) =>
        cookieStore.set({ name, value, ...options }),
      remove: (name, options) =>
        cookieStore.set({ name, value: "", ...options, maxAge: 0 }),
    },
  });
}

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createSupabaseRouteClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
