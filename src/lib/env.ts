import { z } from "zod";

/**
 * Environment configuration — validated once at module load.
 * Source of truth: .cursor/rules/12-coding-standards.mdc (validate external data).
 *
 * Server-only secrets must NOT be prefixed with NEXT_PUBLIC_.
 * Anything the browser needs MUST be prefixed NEXT_PUBLIC_ and is safe to expose.
 */

/** Empty env strings count as unset (dotenv often sets `KEY=""`). */
const optionalNonEmptyString = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().min(1).optional(),
);

const optionalUrl = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().url().optional(),
);

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_ANALYTICS_ENABLED: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: optionalNonEmptyString,
});

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NOCODB_BASE_URL: optionalUrl,
  NOCODB_API_TOKEN: optionalNonEmptyString,
  NOCODB_REGISTRATIONS_TABLE_ID: optionalNonEmptyString,
  NOCODB_FEEDBACK_TABLE_ID: optionalNonEmptyString,
  NOCODB_SURVEY_TABLE_ID: optionalNonEmptyString,
  RAZORPAY_KEY_ID: optionalNonEmptyString,
  RAZORPAY_KEY_SECRET: optionalNonEmptyString,
});

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
}

const parsedClient = clientSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
});

if (!parsedClient.success) {
  throw new Error(
    `Invalid client environment variables:\n${formatIssues(parsedClient.error)}`,
  );
}

const parsedServer = serverSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NOCODB_BASE_URL: process.env.NOCODB_BASE_URL,
  NOCODB_API_TOKEN: process.env.NOCODB_API_TOKEN,
  NOCODB_REGISTRATIONS_TABLE_ID: process.env.NOCODB_REGISTRATIONS_TABLE_ID,
  NOCODB_FEEDBACK_TABLE_ID: process.env.NOCODB_FEEDBACK_TABLE_ID,
  NOCODB_SURVEY_TABLE_ID: process.env.NOCODB_SURVEY_TABLE_ID,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
});

if (!parsedServer.success) {
  throw new Error(
    `Invalid server environment variables:\n${formatIssues(parsedServer.error)}`,
  );
}

/** Browser-safe environment values. */
export const clientEnv = parsedClient.data;

/** Server-only environment values. Never import this into a client component. */
export const serverEnv = parsedServer.data;

export const isProduction = parsedServer.data.NODE_ENV === "production";

/** True when registration payment + NocoDB persistence can run. */
export function isPaymentsConfigured(): boolean {
  return Boolean(
    serverEnv.NOCODB_BASE_URL &&
      serverEnv.NOCODB_API_TOKEN &&
      serverEnv.NOCODB_REGISTRATIONS_TABLE_ID &&
      serverEnv.RAZORPAY_KEY_ID &&
      serverEnv.RAZORPAY_KEY_SECRET,
  );
}

/** True when feedback persistence can run. */
export function isFeedbackConfigured(): boolean {
  return Boolean(
    serverEnv.NOCODB_BASE_URL &&
      serverEnv.NOCODB_API_TOKEN &&
      serverEnv.NOCODB_FEEDBACK_TABLE_ID,
  );
}

/** True when post-masterclass survey persistence can run. */
export function isSurveyConfigured(): boolean {
  return Boolean(
    serverEnv.NOCODB_BASE_URL &&
      serverEnv.NOCODB_API_TOKEN &&
      serverEnv.NOCODB_SURVEY_TABLE_ID,
  );
}
