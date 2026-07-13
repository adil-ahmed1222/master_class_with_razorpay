import { NextResponse } from "next/server";
import { isFeedbackConfigured } from "@/lib/env";
import { createFeedback } from "@/lib/nocodb/feedback";
import { feedbackSchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!isFeedbackConfigured()) {
    return NextResponse.json(
      { error: "Feedback system is not configured." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid feedback." },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    await createFeedback({
      heard_from: data.heardFrom,
      hoping_to_learn: data.hopingToLearn,
      current_role: data.currentRole,
      ai_experience_level: data.aiExperienceLevel,
      biggest_challenge: data.biggestChallenge,
    });
  } catch (error) {
    console.error("NocoDB feedback insert failed:", error);
    return NextResponse.json(
      { error: "Could not save feedback. Try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
