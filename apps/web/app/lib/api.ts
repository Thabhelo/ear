import { getCurrentUserToken } from "./firebase";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/** Maps HTTP failures to copy a caller should actually read. */
function friendlyMessage(status: number): string {
  switch (status) {
    case 401:
      return "Please sign in to continue.";
    case 403:
      return "That session isn't linked to this account.";
    case 404:
      return "We couldn't find that session. Start a new one and try again.";
    case 409:
      return "That step was already completed.";
    case 429:
      return "Too many attempts. Give it a moment and try again.";
    default:
      return "Something went wrong on our side. Please try again.";
  }
}

export class ApiError extends Error {
  status: number;
  constructor(status: number) {
    super(friendlyMessage(status));
    this.status = status;
  }
}

async function authHeaders(): Promise<HeadersInit> {
  const token = await getCurrentUserToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function request<TResponse>(path: string, init: RequestInit): Promise<TResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch {
    throw new Error("We couldn't reach Ear. Check your connection and try again.");
  }

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  return response.json() as Promise<TResponse>;
}

export async function apiPost<TResponse>(
  path: string,
  body: Record<string, unknown>
): Promise<TResponse> {
  return request<TResponse>(path, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(body)
  });
}

export async function apiGet<TResponse>(path: string): Promise<TResponse> {
  return request<TResponse>(path, { headers: await authHeaders() });
}
