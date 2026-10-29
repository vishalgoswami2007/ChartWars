/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const AUTH = `${API_URL}/api/v1/auth`;

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Only one refresh at a time. Refresh tokens are one-time-use, so two parallel
// refreshes would look like token theft to the server and log the user out.
let refreshing = null;
function refreshSession() {
  if (!refreshing) {
    refreshing = fetch(`${AUTH}/refresh`, { method: "POST", credentials: "include" })
      .then(async (res) => (res.ok ? (await res.json()).user : null))
      .catch(() => null)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

// Use this for every protected API call later (trades, rooms, etc.).
// If the access token expired it refreshes once and retries automatically.
export async function apiFetch(path, options = {}) {
  const run = () =>
    fetch(`${API_URL}${path}`, {
      credentials: "include",
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  let res = await run();
  if (res.status === 401 && (await refreshSession())) res = await run();
  return res;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      let me = null;
      try {
        const res = await fetch(`${AUTH}/me`, { credentials: "include" });
        if (res.ok) me = (await res.json()).user;
        else if (res.status === 401) me = await refreshSession();
      } catch {
        // server offline: treat as logged out
      }
      if (active) {
        setUser(me);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${AUTH}/logout`, { method: "POST", credentials: "include" });
    } catch {
      // ignore, we clear local state anyway
    }
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, setUser, loading, logout }), [user, loading, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function Splash() {
  return <div className="grid h-dvh place-items-center bg-[#050505] text-sm text-zinc-500">Loading...</div>;
}

// Dashboard etc. go inside this.
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Splash />;
  return user ? (children ?? <Outlet />) : <Navigate to="/login" replace state={{ from: location }} />;
}

// Login / signup pages go inside this (logged-in users get sent to the dashboard).
export function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  return user ? <Navigate to="/dashboard" replace /> : (children ?? <Outlet />);
}