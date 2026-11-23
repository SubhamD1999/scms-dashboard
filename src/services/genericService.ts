import { env } from "../config/env";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/* ---------------- Token storage ---------------- */

const TOKEN_KEY = "store:token";

export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
    }
  },
};


export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}


export interface RequestOptions<B = unknown> {
  method?: HttpMethod;
  body?: B;
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  auth?: boolean;
  signal?: AbortSignal;
}

function buildUrl(endpoint: string, params?: RequestOptions["params"]) {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${env.API_BASE_URL}${path}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

export async function apiRequest<T = unknown, B = unknown>(
  endpoint: string,
  { method = "GET", body, params, headers, auth = true, signal }: RequestOptions<B> = {}
): Promise<T> {
  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = tokenStorage.get();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  // Build the URL OUTSIDE the try so URL errors aren't mislabeled as network errors
  const fullUrl = buildUrl(endpoint, params);
  console.log("[API]", method, fullUrl);

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    console.error("[API] fetch failed:", err);
    throw new ApiError("Unable to reach the server. Check your connection.", 0);
  }

  let data: unknown = null;
  if (response.status !== 204) {
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
  }

  if (!response.ok) {
    if (response.status === 401 && auth) {
      tokenStorage.clear();
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    const message =
      (typeof data === "object" && data !== null &&
        ((data as Record<string, unknown>).message as string | undefined ||
          (data as Record<string, unknown>).error as string | undefined)) ||
      (typeof data === "string" && data) ||
      `Request failed (${response.status})`;

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}


export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T, B = unknown>(endpoint: string, body?: B, options?: Omit<RequestOptions<B>, "method" | "body">) =>
    apiRequest<T, B>(endpoint, { ...options, method: "POST", body }),

  put: <T, B = unknown>(endpoint: string, body?: B, options?: Omit<RequestOptions<B>, "method" | "body">) =>
    apiRequest<T, B>(endpoint, { ...options, method: "PUT", body }),

  patch: <T, B = unknown>(endpoint: string, body?: B, options?: Omit<RequestOptions<B>, "method" | "body">) =>
    apiRequest<T, B>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};