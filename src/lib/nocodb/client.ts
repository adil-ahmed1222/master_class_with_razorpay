import { serverEnv } from "@/lib/env";

type NocoDbErrorBody = {
  msg?: string;
  message?: string;
};

export class NocoDbError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "NocoDbError";
    this.status = status;
  }
}

function getConfig() {
  const baseUrl = serverEnv.NOCODB_BASE_URL?.replace(/\/$/, "");
  const token = serverEnv.NOCODB_API_TOKEN;

  if (!baseUrl || !token) {
    throw new Error("NocoDB is not configured.");
  }

  return { baseUrl, token };
}

/**
 * Server-only NocoDB Data API helper (v2).
 * Auth: xc-token header. Never call from client components.
 */
export async function nocodbFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const { baseUrl, token } = getConfig();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "xc-token": token,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let detail = `NocoDB request failed (${response.status})`;
    try {
      const body = (await response.json()) as NocoDbErrorBody;
      detail = body.msg ?? body.message ?? detail;
    } catch {
      // ignore JSON parse errors
    }
    throw new NocoDbError(detail, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function registrationsTableId(): string {
  const id = serverEnv.NOCODB_REGISTRATIONS_TABLE_ID;
  if (!id) {
    throw new Error("NOCODB_REGISTRATIONS_TABLE_ID is not configured.");
  }
  return id;
}

export function feedbackTableId(): string {
  const id = serverEnv.NOCODB_FEEDBACK_TABLE_ID;
  if (!id) {
    throw new Error("NOCODB_FEEDBACK_TABLE_ID is not configured.");
  }
  return id;
}
