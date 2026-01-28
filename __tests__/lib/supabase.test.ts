import { getSupabaseUrl } from "@/lib/supabase/config";

describe("supabase config", () => {
  it("reads the url", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    expect(getSupabaseUrl()).toBe("https://test.supabase.co");
  });
});
