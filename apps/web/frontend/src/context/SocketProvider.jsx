import { useEffect } from "react";
import { socket } from "../lib/socket";

export function SocketProvider({ enabled, children }) {
  useEffect(() => {
    if (!enabled) return;
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [enabled]);

  return children;
}