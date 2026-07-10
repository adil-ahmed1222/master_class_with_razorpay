import { z } from "zod";

/**
 * Environment configuration — validated once at module load.
 * Source of truth: .cursor/rules/12-coding-standards.mdc (validate external data).
 *
 * Server-only secrets must NOT be prefixed with NEXT_PUBLIC_.
 * Anything the browser needs MUST be prefixed NEXT_PUBLIC_ and is safe to expose.
 */

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_ANALYTICS_ENABLED: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1).optional(),
});

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  RAZORPAY_KEY_ID: z.string().min(1).optional(),
  RAZORPAY_KEY_SECRET: z.string().min(1).optional(),
});

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
}

const parsedClient = clientSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
});

if (!parsedClient.success) {
  throw new Error(
    `Invalid client environment variables:\n${formatIssues(parsedClient.error)}`,
  );
}

const parsedServer = serverSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
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

/** True when payment + persistence API routes can run. */
export function isPaymentsConfigured(): boolean {
  return Boolean(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL &&
      serverEnv.SUPABASE_SERVICE_ROLE_KEY &&
      serverEnv.RAZORPAY_KEY_ID &&
      serverEnv.RAZORPAY_KEY_SECRET,
  );
}
