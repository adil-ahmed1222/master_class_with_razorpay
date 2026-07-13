import { nocodbFetch, surveyTableId } from "@/lib/nocodb/client";

export type CreateSurveyInput = {
  full_name?: string;
  email?: string;
  registration_id?: string;
  phone_number?: string;
  course_name?: string;
  overall_rating?: number;
  content_rating?: number;
  instructor_rating?: number;
  recommendation_score?: number;
  most_valuable?: string;
  what_to_improve?: string;
  would_attend_again?: "Yes" | "No" | "Maybe";
  topics_for_next?: string;
  testimonial?: string;
  allow_testimonial_use?: boolean;
  session_date?: string;
};

export type SurveyRecord = {
  Id: number | string;
} & CreateSurveyInput;

export async function createSurvey(
  input: CreateSurveyInput,
): Promise<SurveyRecord> {
  const tableId = surveyTableId();
  const created = await nocodbFetch<SurveyRecord | SurveyRecord[]>(
    `/api/v2/tables/${tableId}/records`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  const row = Array.isArray(created) ? created[0] : created;
  if (!row?.Id) {
    throw new Error("NocoDB did not return a survey Id.");
  }

  return row;
}
