import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { verifyWebhook } from "@/lib/webhook";

export async function POST(req: Request) {
  const supabase = createServerClient();
  const payload = await req.text();
  const signature = req.headers.get("x-kie-signature") || "";

  if (!verifyWebhook(signature, payload)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const body = JSON.parse(payload);
  const { job_id, status, result_image_url } = body;

  await supabase
    .from("job_history")
    .update({
      status,
      result_image_url,
      completed_at: new Date().toISOString(),
    })
    .eq("id", job_id);

  return NextResponse.json({ ok: true });
}
