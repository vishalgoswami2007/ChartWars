// Server se baat karne ka ek hi jagah. Cookies bhejta hai aur 401 pe ek baar refresh try karta hai.
const ROOT = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const BASE = /\/api\/v1$/.test(ROOT) ? ROOT : `${ROOT}/api/v1`;

const REFRESH_PATH = "/auth/refresh";

export class ApiError extends Error {
  constructor(message, status = 0, code = "", errors = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

let refreshing = null;

// Ek saath kai 401 aayein to refresh sirf ek baar chalega
function refreshSession() {
  if (!refreshing) {
    refreshing = fetch(`${BASE}${REFRESH_PATH}`, { method: "POST", credentials: "include" })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

async function request(method, path, body, retry = true) {
  const options = { method, credentials: "include" };
  if (body !== undefined) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, options);
  } catch {
    throw new ApiError("Cannot reach the server. Check your internet and try again.", 0, "NETWORK");
  }

  if (res.status === 401 && retry && !path.startsWith("/auth/")) {
    if (await refreshSession()) return request(method, path, body, false);
    window.dispatchEvent(new Event("cw:auth-expired"));
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new ApiError(data?.message || "Something went wrong. Try again.", res.status, data?.code, data?.errors);
  }
  return data;
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body ?? {}),
  put: (path, body) => request("PUT", path, body ?? {}),
  delete: (path, body) => request("DELETE", path, body),
};