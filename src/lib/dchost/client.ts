import { getDchostApiUrl } from "./config";
import type { DchostTokens } from "./types";

export class DchostApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "DchostApiError";
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  token?: string | null;
  body?: unknown;
  form?: Record<string, string>;
};

export async function dchostRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const base = await getDchostApiUrl();
  const url = `${base}/${path.replace(/^\//, "")}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let body: BodyInit | undefined;
  if (options.form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    body = new URLSearchParams(options.form).toString();
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body,
    cache: "no-store",
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (typeof data === "object" &&
        data &&
        ("error" in data || "message" in data) &&
        String((data as { error?: string; message?: string }).error || (data as { message?: string }).message)) ||
      `Bağlantı hatası (${res.status})`;
    throw new DchostApiError(message, res.status, data);
  }

  return data as T;
}

export async function dchostLogin(username: string, password: string): Promise<DchostTokens> {
  const data = await dchostRequest<{ token?: string; refresh?: string }>("login", {
    method: "POST",
    body: { username, password },
  });
  if (!data.token || !data.refresh) {
    throw new DchostApiError("Token alınamadı", 500, data);
  }
  return { token: data.token, refresh: data.refresh };
}

export async function dchostRefresh(refreshToken: string): Promise<DchostTokens> {
  const data = await dchostRequest<{ token?: string; refresh?: string }>("token", {
    method: "POST",
    body: { refresh_token: refreshToken },
  });
  if (!data.token) {
    throw new DchostApiError("Token yenilenemedi", 401, data);
  }
  return { token: data.token, refresh: data.refresh || refreshToken };
}

export async function dchostLogout(token: string) {
  try {
    await dchostRequest("logout", { method: "POST", token });
  } catch {
    // ignore logout failures
  }
}
