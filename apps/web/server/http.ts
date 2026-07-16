import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";

/** Mirrors FastAPI's HTTPException: a status code plus a `detail` message. */
export class HttpError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

function handleApiError(error: unknown): NextResponse {
  if (error instanceof HttpError) {
    return NextResponse.json({ detail: error.detail }, { status: error.status });
  }
  if (error instanceof ZodError) {
    // FastAPI returned 422 with issue details for invalid payloads.
    return NextResponse.json({ detail: error.issues }, { status: 422 });
  }
  console.error("Unhandled API error:", error);
  return NextResponse.json({ detail: "Internal server error." }, { status: 500 });
}

/** Parses and validates a JSON request body against a schema (422 on failure). */
export async function parseBody<T>(request: Request, schema: ZodType<T>): Promise<T> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    throw new HttpError(422, "Request body must be valid JSON.");
  }
  return schema.parse(payload);
}

type RouteHandler = (request: Request) => Promise<Response>;

/** Wraps a route handler with FastAPI-style error responses. */
export function apiRoute(handler: RouteHandler): RouteHandler {
  return async (request) => {
    try {
      return await handler(request);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
