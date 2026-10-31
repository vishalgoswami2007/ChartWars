const ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const BASE = `${ORIGIN}/api/v1`;

export class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request(method, path, body) {
  const hasBody = body !== undefined;
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: "include",
    headers: hasBody ? { "Content-Type": "application/json" } : undefined,
    body: hasBody ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(data?.message || "Request failed", res.status, data?.code, data?.errors);
  }
  return data;
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body = {}) => request("POST", path, body),
  put: (path, body = {}) => request("PUT", path, body),
  patch: (path, body = {}) => request("PATCH", path, body),
  delete: (path, body) => request("DELETE", path, body),
};