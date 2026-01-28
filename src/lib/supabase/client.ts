import { createClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/config";

export function createBrowserClient() {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey());
}
