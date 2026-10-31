import { apiFetch } from "../../pages/auth/AuthProvider";

async function call(method, path, body) {
  const res = await apiFetch(`/api/v1${path}`, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

export const createRoom = (body) => call("POST", "/rooms", body);
export const requestJoin = (code) => call("POST", "/rooms/join", { code });
export const approveJoin = (body) => call("POST", "/rooms/approve", body);
export const getRoom = (code) => call("GET", `/rooms/${code}`);