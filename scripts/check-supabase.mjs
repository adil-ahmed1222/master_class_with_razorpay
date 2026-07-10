import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  const raw = readFileSync(path, "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let value = trimmed.slice(eq + 1);
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = loadEnvLocal();
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const { data, error } = await supabase
  .from("masterclass_registrations")
  .insert({
    full_name: "Test User",
    email: `test-${Date.now()}@example.com`,
    phone_number: "9999999999",
    country_code: "IN",
    city: "Test",
    user_role: "Student",
    amount_paid: 111,
    payment_status: "unpaid",
    course_name: "NeuralVarsity Agentic AI Masterclass — Build Your First AI Employee",
  })
  .select("id")
  .single();

console.log(JSON.stringify({ data, error }, null, 2));

if (data?.id) {
  await supabase.from("masterclass_registrations").delete().eq("id", data.id);
  console.log("Cleaned up test row.");
}
