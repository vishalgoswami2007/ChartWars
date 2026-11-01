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

export const discoverUsers = (q = "") => call("GET", `/friends/discover?q=${encodeURIComponent(q)}`);
export const listFriends = () => call("GET", "/friends");
export const listRequests = () => call("GET", "/friends/requests");
export const listSent = () => call("GET", "/friends/sent");
export const sendRequest = (userId) => call("POST", "/friends/request", { userId });
export const respondRequest = (requestId, accept) => call("POST", "/friends/respond", { requestId, accept });
export const removeFriend = (userId) => call("DELETE", `/friends/${userId}`);
export const getMessages = (userId, before) =>
  call("GET", `/friends/${userId}/messages${before ? `?before=${encodeURIComponent(before)}` : ""}`);
export const markRead = (userId) => call("POST", `/friends/${userId}/read`, {});