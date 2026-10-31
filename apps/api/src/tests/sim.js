import { io } from "socket.io-client";

const [TOKEN_A, TOKEN_B] = process.argv.slice(2);
const URL = "http://localhost:4000";

const mk = (token, name) => {
  const s = io(URL, { auth: { token } });
  s.on("connect_error", e => console.log(name, "CONNECT ERR", e.message));
  s.on("connect", () => { console.log(name, "queue join"); s.emit("queue:join", { durationSec: 60 }); });
  s.on("match:found", ({ code }) => {
    console.log(name, "FOUND", code);
    s.emit("room:join", { code });
    setTimeout(() => s.emit("trade:buy", { code, amount: 5000 }), 8000);
  });
  s.on("match:update", d => console.log(name, d.players.map(p => Math.round(p.value))));
  s.on("match:end", d => { console.log(name, "END", d.results); setTimeout(() => process.exit(), 500); });
  s.on("trade:error", e => console.log(name, "TRADE ERR", e));
  s.on("queue:timeout", d => { console.log(name, d.message); process.exit(); });
  s.on("queue:error", e => console.log(name, "QUEUE ERR", e));
};

mk(TOKEN_A, "A");
if (TOKEN_B) mk(TOKEN_B, "B");