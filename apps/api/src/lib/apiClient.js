import { refreshSession } from "../pages/auth/AuthProvider";

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

function send(method, path, body) {
  const hasBody = body !== undefined;
  return fetch(`${BASE}${path}`, {
    method,
    credentials: "include",
     cache: "no-store",
    headers: hasBody ? { "Content-Type": "application/json" } : undefined,
    body: hasBody ? JSON.stringify(body) : undefined,
  });
}

async function request(method, path, body) {
  let res = await send(method, path, body);

  // Access token expire ho gaya ho to ek baar refresh karke dobara try.
  // /auth/ wale calls (login, logout) ko chhod ke.
  if (res.status === 401 && !path.startsWith("/auth/")) {
    if (await refreshSession()) {
      res = await send(method, path, body);
    } else {
      window.dispatchEvent(new Event("cw:auth-expired")); // accountStore isi ka intezar karta hai
    }
  }

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