import { useCallback, useEffect, useState } from "react";

import { socket } from "../../lib/socket";
import * as api from "./friendsApi";

/** Ek friend ke saath chat. Isko render karte waqt <ChatPanel key={friend.id} /> use kar, taaki friend badalne par state reset ho. */
export function useChat(friendId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(Boolean(friendId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!friendId) return undefined;
    let alive = true;

    api
      .getMessages(friendId)
      .then((data) => alive && setMessages(data.messages))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));

    const onMessage = (m) => {
      if (m.from !== friendId && m.to !== friendId) return;
      setMessages((list) => (list.some((x) => x.id === m.id) ? list : [...list, m]));
      if (m.from === friendId) api.markRead(friendId).catch(() => {});
    };

    socket.on("chat:message", onMessage);
    return () => {
      alive = false;
      socket.off("chat:message", onMessage);
    };
  }, [friendId]);

  // null = sent, warna error text
  const send = useCallback(
    (text) =>
      new Promise((resolve) => {
        socket.timeout(8000).emit("chat:send", { to: friendId, text }, (err, res) => {
          if (err) return resolve("Message timed out. Check your connection.");
          if (!res?.ok) return resolve(res?.error || "Could not send the message");
          setMessages((list) => (list.some((x) => x.id === res.message.id) ? list : [...list, res.message]));
          resolve(null);
        });
      }),
    [friendId]
  );

  return { messages, loading, error, send };
}