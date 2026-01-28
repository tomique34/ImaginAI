import { NextResponse } from "next/server";
import { applyCreditDebit } from "@/lib/credits";
import { startKieJob } from "@/lib/kie-client";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createServerClient();
  const body = await req.json();
  const { userId, projectId, prompt, imageUrl } = body;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("credits_balance")
    .eq("id", userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  let nextBalance: number;
  try {
    nextBalance = applyCreditDebit(profile.credits_balance, 1);
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_CREDITS") {
      return NextResponse.json(
        { error: "insufficient_credits" },
        { status: 402 }
      );
    }
    throw error;
  }

  await supabase
    .from("profiles")
    .update({ credits_balance: nextBalance })
    .eq("id", userId);

  const { data: job } = await supabase
    .from("job_history")
    .insert({
      project_id: projectId,
      user_id: userId,
      prompt,
      ai_model: "nano-banana",
    })
    .select()
    .single();

  await startKieJob({ prompt, imageUrl });

  return NextResponse.json({ jobId: job.id });
}
