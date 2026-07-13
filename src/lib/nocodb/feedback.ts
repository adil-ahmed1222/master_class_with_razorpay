import { feedbackTableId, nocodbFetch } from "@/lib/nocodb/client";

export type CreateFeedbackInput = {
  heard_from?: string;
  hoping_to_learn?: string;
  current_role?: string;
  ai_experience_level?: string;
  biggest_challenge?: string;
};

export type FeedbackRecord = {
  Id: number | string;
} & CreateFeedbackInput;

export async function createFeedback(
  input: CreateFeedbackInput,
): Promise<FeedbackRecord> {
  const tableId = feedbackTableId();
  const created = await nocodbFetch<FeedbackRecord | FeedbackRecord[]>(
    `/api/v2/tables/${tableId}/records`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  const row = Array.isArray(created) ? created[0] : created;
  if (!row?.Id) {
    throw new Error("NocoDB did not return a feedback Id.");
  }

  return row;
}
