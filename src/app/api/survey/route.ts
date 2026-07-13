import { NextResponse } from "next/server";
import { event } from "@/content/event";
import { isSurveyConfigured } from "@/lib/env";
import { createSurvey } from "@/lib/nocodb/survey";
import { surveySchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!isSurveyConfigured()) {
    return NextResponse.json(
      { error: "Survey system is not configured." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = surveySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid survey." },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const courseName =
    data.courseName?.trim() ||
    `${event.brand} ${event.series} — ${event.title}`;

  try {
    const record = await createSurvey({
      full_name: data.fullName || undefined,
      email: data.email || undefined,
      registration_id: data.registrationId || undefined,
      phone_number: data.phoneNumber || undefined,
      course_name: courseName,
      overall_rating: data.overallRating,
      content_rating: data.contentRating,
      instructor_rating: data.instructorRating,
      recommendation_score: data.recommendationScore,
      most_valuable: data.mostValuable || undefined,
      what_to_improve: data.whatToImprove || undefined,
      would_attend_again: data.wouldAttendAgain,
      topics_for_next: data.topicsForNext || undefined,
      testimonial: data.testimonial || undefined,
      allow_testimonial_use: data.allowTestimonialUse ?? false,
      session_date: data.sessionDate || undefined,
    });

    return NextResponse.json({ ok: true, id: String(record.Id) });
  } catch (error) {
    console.error("NocoDB survey insert failed:", error);
    return NextResponse.json(
      { error: "Could not save survey. Try again." },
      { status: 500 },
    );
  }
}
