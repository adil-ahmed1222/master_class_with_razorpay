import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { clientEnv, serverEnv } from "@/lib/env";

/** Existing Supabase table for masterclass sign-ups. */
export const REGISTRATIONS_TABLE = "masterclass_registrations" as const;

export type RegistrationRow = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  country_code: string;
  city: string;
  user_role: string;
  payment_id: string | null;
  order_id: string | null;
  payment_signature: string | null;
  amount_paid: number;
  payment_status: string;
  course_name: string;
  created_at: string;
};

let adminClient: SupabaseClient | null = null;

/** Server-only Supabase client with service role (bypasses RLS). */
export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = clientEnv.NEXT_PUBLIC_SUPABASE_URL;
  const key = serverEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase is not configured.");
  }

  adminClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return adminClient;
}
