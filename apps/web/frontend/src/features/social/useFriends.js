import { useCallback, useEffect, useRef, useState } from "react";

import { socket } from "../../lib/socket";
import * as api from "./friendsApi";

/** Friends, incoming/sent requests, aur live online dot. activeId = abhi khuli chat ka friend. */
export function useFriends(activeId = null) {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const activeRef = useRef(activeId);

  useEffect(() => {
    activeRef.current = activeId;
  }, [activeId]);

  const refresh = useCallback(async () => {
    try {
      const [f, r, s] = await Promise.all([api.listFriends(), api.listRequests(), api.listSent()]);
      setFriends(f.friends);
      setRequests(r.requests);
      setSent(s.sent);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

   useEffect(() => {
    // Pehla fetch defer karte hain, taaki effect ke andar seedha setState na ho
    const first = setTimeout(refresh, 0);

    const onPresence = ({ userId, online }) =>
      setFriends((list) => list.map((f) => (f.id === userId ? { ...f, online } : f)));

    const onMessage = (m) =>
      setFriends((list) =>
        list.map((f) => {
          if (f.id === m.from) {
            return {
              ...f,
              lastMessage: { text: m.text, mine: false, at: m.at },
              unread: activeRef.current === f.id ? 0 : f.unread + 1,
            };
          }
          if (f.id === m.to) return { ...f, lastMessage: { text: m.text, mine: true, at: m.at } };
          return f;
        })
      );

    socket.on("presence:update", onPresence);
    socket.on("chat:message", onMessage);
    socket.on("friend:request", refresh);
    socket.on("friend:update", refresh);
    socket.on("connect", refresh); // reconnect pe sab dobara sync

    return () => {
      clearTimeout(first);
      socket.off("presence:update", onPresence);
      socket.off("chat:message", onMessage);
      socket.off("friend:request", refresh);
      socket.off("friend:update", refresh);
      socket.off("connect", refresh);
    };
  }, [refresh]);

  // Har action ke baad lists dobara laate hain. Error message wapas aata hai (null = sab theek).
  const act = async (fn) => {
    try {
      await fn();
      await refresh();
      return null;
    } catch (e) {
      return e.message;
    }
  };

  return {
    friends,
    requests,
    sent,
    loading,
    error,
    refresh,
    sendRequest: (userId) => act(() => api.sendRequest(userId)),
    respond: (requestId, accept) => act(() => api.respondRequest(requestId, accept)),
    unfriend: (userId) => act(() => api.removeFriend(userId)),
    clearUnread: (userId) => setFriends((list) => list.map((f) => (f.id === userId ? { ...f, unread: 0 } : f))),
  };
}

/** Discover tab: search ke saath log. version badalne par dobara fetch hota hai. */
export function useDiscover(query, version = 0) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const id = setTimeout(
      async () => {
        try {
          const data = await api.discoverUsers(query);
          if (alive) setUsers(data.users);
        } catch {
          if (alive) setUsers([]);
        } finally {
          if (alive) setLoading(false);
        }
      },
      query ? 300 : 0
    );
    return () => {
      alive = false;
      clearTimeout(id);
    };
  }, [query, version]);

  return { users, loading };
}