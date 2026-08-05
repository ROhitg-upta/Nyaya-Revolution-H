/**
 * Thin, typed wrapper around `fetch` used as the foundation for the services
 * layer. Feature-specific services (content, progress, payments, …) should be
 * built on top of this rather than calling `fetch` directly, so retries,
 * headers, base URLs, and error handling stay consistent in one place.
 *
 * This is infrastructure only — it wires up NO endpoints or business logic.
 */

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: unknown,
  ) {
    super(`HTTP ${status} ${statusText}`);
    this.name = "HttpError";
  }
}

export interface HttpRequestOptions extends RequestInit {
  /** Parsed and appended to the URL as a query string. */
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, params?: HttpRequestOptions["params"]): string {
  if (!params) return path;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.append(key, String(value));
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}

/** Performs a JSON request and returns the typed response body. */
export async function http<T>(
  path: string,
  { params, headers, ...init }: HttpRequestOptions = {},
): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...init,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText, body);
  }

  return body as T;
}
