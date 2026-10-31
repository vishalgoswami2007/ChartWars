import { useEffect, useState } from "react";
import { socket } from "../../lib/socket";

export function useRoomSocket(code) {
  const [room, setRoom] = useState(null);
  const [requests, setRequests] = useState([]);
  const [match, setMatch] = useState(null);
  const [phase, setPhase] = useState("lobby");   // lobby | countdown | live | ended
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!code) return undefined;

    const join = () => socket.emit("room:join", { code });
    const onState = (r) => {
      setRoom(r);
      if (Array.isArray(r.pending)) setRequests(r.pending);   // sirf host ko aati hai
    };
    const onRequest = (req) => {
      if (req.code !== code) return;
      setRequests((list) =>
        list.some((x) => x._id === req.userId)
          ? list
          : [...list, { _id: req.userId, username: req.username, elo: req.elo }]
      );
    };
    const onCountdown = () => setPhase("countdown");
    const onUpdate = (m) => {
      setMatch(m);
      if (m.status === "live") setPhase("live");
    };
    const onEnd = (r) => {
      setResult(r);
      setPhase("ended");
    };
    const onClosed = () => setClosed(true);
    const onError = (e) => setError(String(e));

    socket.on("room:state", onState);
    socket.on("room:join-request", onRequest);
    socket.on("match:countdown", onCountdown);
    socket.on("match:update", onUpdate);
    socket.on("match:end", onEnd);
    socket.on("room:closed", onClosed);
    socket.on("room:error", onError);
    socket.on("trade:error", onError);
    socket.on("connect", join);
    if (socket.connected) join();

    return () => {
      socket.off("room:state", onState);
      socket.off("room:join-request", onRequest);
      socket.off("match:countdown", onCountdown);
      socket.off("match:update", onUpdate);
      socket.off("match:end", onEnd);
      socket.off("room:closed", onClosed);
      socket.off("room:error", onError);
      socket.off("trade:error", onError);
      socket.off("connect", join);
    };
  }, [code]);

  return {
    room, requests, match, phase, result, error, closed,
    clearRequest: (id) => setRequests((list) => list.filter((x) => x._id !== id)),
    setReady: (ready) => socket.emit("room:ready", { code, ready }),
    start: () => socket.emit("room:start", { code }),
    leave: () => socket.emit("room:leave", { code }),
    buy: (amount) => socket.emit("trade:buy", { code, amount }),
    sell: (amount) => socket.emit("trade:sell", { code, amount }),
  };
}