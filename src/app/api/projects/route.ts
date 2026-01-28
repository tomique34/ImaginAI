import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createServerClient();
  const body = await req.json();
  const { userId, name, originalImageUrl } = body;

  const { data, error } = await supabase
    .from("projects")
    .insert({ user_id: userId, name, original_image_url: originalImageUrl })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
