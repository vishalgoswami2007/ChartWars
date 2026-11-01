import { useEffect, useRef, useState } from "react";
import { socket } from "../../lib/socket";

const BUCKET = 5; // seconds per candle
const MAX_CANDLES = 600;

function addTick(list, price, at = Date.now()) {
  const bucket = Math.floor(at / 1000 / BUCKET) * BUCKET;
  const last = list[list.length - 1];
  if (!last || bucket > last.time) {
    const open = last ? last.close : price;
    list.push({ time: bucket, open, high: Math.max(open, price), low: Math.min(open, price), close: price });
    if (list.length > MAX_CANDLES) list.shift();
  } else {
    last.high = Math.max(last.high, price);
    last.low = Math.min(last.low, price);
    last.close = price;
  }
}

export function useRoomSocket(code) {
  const [room, setRoom] = useState(null);
  const [requests, setRequests] = useState([]);
  const [match, setMatch] = useState(null);
  const [candles, setCandles] = useState([]);
  const [deadline, setDeadline] = useState(null);
  const [phase, setPhase] = useState("lobby"); // lobby | countdown | live | ended
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [closed, setClosed] = useState(false);
  const candleRef = useRef([]);

  useEffect(() => {
    if (!code) return undefined;

    const join = () => socket.emit("room:join", { code });
    const onState = (r) => {
      setRoom(r);
      if (Array.isArray(r.pending)) setRequests(r.pending); // sirf host ko aati hai
    };
    const onRequest = (req) => {
      if (req.code !== code) return;
      setRequests((list) =>
        list.some((x) => x._id === req.userId)
          ? list
          : [...list, { _id: req.userId, username: req.username, elo: req.elo }]
      );
    };
    const onCountdown = () => setPhase((p) => (p === "ended" ? p : "countdown"));
    const onStart = ({ timeLeft }) => {
      setDeadline(Date.now() + timeLeft);
      setPhase("live");
    };
    const onUpdate = (m) => {
      setMatch(m);
      if (m.timeLeft != null) setDeadline(Date.now() + m.timeLeft);
      setPhase((p) => (p === "ended" ? p : m.status === "live" ? "live" : m.status === "countdown" ? "countdown" : p));
      if (Number.isFinite(m.price)) {
        addTick(candleRef.current, m.price);
        setCandles(candleRef.current.slice());
      }
    };
    const onEnd = (r) => {
      setResult(r);
      setPhase("ended");
    };
    const onClosed = () => setClosed(true);
    const onError = (e) => {
      setError(String(e));
      setTimeout(() => setError(""), 4000);
    };

    const onHistory = (ticks) => {
  const list = [];
  for (const { t, p } of ticks) addTick(list, p, t);
  candleRef.current = list;
  setCandles(list.slice());
};

    socket.on("room:state", onState);
    socket.on("room:join-request", onRequest);
    socket.on("match:countdown", onCountdown);
    socket.on("match:start", onStart);
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
      socket.off("match:start", onStart);
      socket.off("match:update", onUpdate);
      socket.off("match:end", onEnd);
      socket.off("room:closed", onClosed);
      socket.off("room:error", onError);
      socket.off("trade:error", onError);
      socket.off("connect", join);
    };
  }, [code]);

  return {
    room, requests, match, candles, deadline, phase, result, error, closed,
    clearError: () => setError(""),
    clearRequest: (id) => setRequests((list) => list.filter((x) => x._id !== id)),
    setReady: (ready) => socket.emit("room:ready", { code, ready }),
    start: () => socket.emit("room:start", { code }),
    leave: () => socket.emit("room:leave", { code }),
    buy: (amount) => socket.emit("trade:buy", { code, amount }),
    sell: (amount) => socket.emit("trade:sell", { code, amount }),
  };
}