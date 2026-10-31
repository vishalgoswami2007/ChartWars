import { io } from "socket.io-client";

const mk = (token, name) => {
  const s = io("http://localhost:5000", { auth: { token } });
  s.on("connect", () => { console.log(name, "connected"); s.emit("queue:join", { durationSec: 60 }); });
  s.on("match:found", ({ code }) => {
    console.log(name, "found", code);
    s.emit("room:join", { code });
    setTimeout(() => s.emit("trade:buy", { code, amount: 5000 }), 8000);
  });
  s.on("match:update", d => console.log(name, d.players.map(p => Math.round(p.value))));
  s.on("match:end", d => console.log(name, "END", d.results));
  s.on("trade:error", e => console.log(name, "ERR", e));
  s.on("queue:timeout", d => console.log(name, d.message));
};

mk("TOKEN_A", "A");
mk("TOKEN_B", "B");