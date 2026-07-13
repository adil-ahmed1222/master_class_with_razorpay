/**
 * Create the Masterclass Survey table in NocoDB (Meta API).
 * Run: node scripts/create-survey-table.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
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
const baseUrl = (env.NOCODB_BASE_URL || "").replace(/\/$/, "");
const token = env.NOCODB_API_TOKEN;
const baseId = process.env.NOCODB_BASE_ID || "pt5kbkfbr7jnmg5";

if (!baseUrl || !token) {
  console.error("Missing NOCODB_BASE_URL or NOCODB_API_TOKEN in .env.local");
  process.exit(1);
}

const columns = [
  { title: "full_name", column_name: "full_name", uidt: "SingleLineText" },
  { title: "email", column_name: "email", uidt: "Email" },
  {
    title: "registration_id",
    column_name: "registration_id",
    uidt: "SingleLineText",
  },
  {
    title: "phone_number",
    column_name: "phone_number",
    uidt: "SingleLineText",
  },
  { title: "course_name", column_name: "course_name", uidt: "SingleLineText" },
  { title: "overall_rating", column_name: "overall_rating", uidt: "Rating" },
  { title: "content_rating", column_name: "content_rating", uidt: "Rating" },
  {
    title: "instructor_rating",
    column_name: "instructor_rating",
    uidt: "Rating",
  },
  {
    title: "recommendation_score",
    column_name: "recommendation_score",
    uidt: "Number",
  },
  { title: "most_valuable", column_name: "most_valuable", uidt: "LongText" },
  {
    title: "what_to_improve",
    column_name: "what_to_improve",
    uidt: "LongText",
  },
  {
    title: "would_attend_again",
    column_name: "would_attend_again",
    uidt: "SingleSelect",
    dtxp: "'Yes','No','Maybe'",
  },
  {
    title: "topics_for_next",
    column_name: "topics_for_next",
    uidt: "LongText",
  },
  { title: "testimonial", column_name: "testimonial", uidt: "LongText" },
  {
    title: "allow_testimonial_use",
    column_name: "allow_testimonial_use",
    uidt: "Checkbox",
  },
  {
    title: "session_date",
    column_name: "session_date",
    uidt: "Date",
  },
];

const res = await fetch(`${baseUrl}/api/v2/meta/bases/${baseId}/tables`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "xc-token": token,
  },
  body: JSON.stringify({
    title: "masterclass_survey",
    table_name: "masterclass_survey",
    description:
      "Post-attendance Masterclass Survey responses. Independent from registrations; soft-linked via email / registration_id.",
    columns,
  }),
});

const text = await res.text();
console.log("status", res.status);
console.log(text.slice(0, 2000));

if (!res.ok) process.exit(1);

try {
  const json = JSON.parse(text);
  const tableId = json.id || json.table_id || json.tableId;
  if (tableId) {
    console.log("\nTABLE_ID=", tableId);
    console.log("Add to .env.local:");
    console.log(`NOCODB_SURVEY_TABLE_ID="${tableId}"`);
  }
} catch {
  // ignore
}
