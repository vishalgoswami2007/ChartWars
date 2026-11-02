import { useCallback, useEffect, useState } from "react";

import { apiFetch } from "../../pages/auth/AuthProvider";

const POLL_MS = 30000;

/** Real leaderboard. Page khula ho to har 30 sec me aur tab wapas aane par refresh hota hai. */
export function useLeaderboard() {
  const [data, setData] = useState({ players: [], me: null, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const res = await apiFetch("/api/v1/leaderboard?limit=100");
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.message || "Could not load the leaderboard");
      setData(body);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(refresh, 0);
    const poll = setInterval(() => {
      if (!document.hidden) refresh();
    }, POLL_MS);
    const onVisible = () => {
      if (!document.hidden) refresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearTimeout(first);
      clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  return { ...data, loading, error, refresh };
}