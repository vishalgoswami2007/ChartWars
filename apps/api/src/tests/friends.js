import { io } from "socket.io-client";

const [CODE, TOKEN_A, TOKEN_B] = process.argv.slice(2);
const URL = "http://localhost:4000";

const mk = (token, name, isHost) => {
  const s = io(URL, { auth: { token } });
  s.on("connect_error", e => console.log(name, "CONNECT ERR", e.message));
  s.on("connect", () => {
    console.log(name, "connected");
    s.emit("room:join", { code: CODE });
    setTimeout(() => s.emit("room:ready", { code: CODE, ready: true }), 500);
    if (isHost) setTimeout(() => s.emit("room:start", { code: CODE }), 2000);
  });
  s.on("room:state", r => console.log(name, "players", r.players.map(p => `${p.user.username}:${p.ready}`)));
  s.on("match:countdown", () => console.log(name, "countdown"));
  s.on("match:start", () => {
    console.log(name, "START");
    if (isHost) setTimeout(() => s.emit("trade:buy", { code: CODE, amount: 3000 }), 3000);
  });
  s.on("match:update", d => console.log(name, d.players.map(p => `${p.username}:${Math.round(p.value)}`)));
  s.on("match:end", d => { console.log(name, "END", d.results.map(r => `${r.username}:${Math.round(r.value)}`)); setTimeout(() => process.exit(), 500); });
  s.on("room:error", e => console.log(name, "ROOM ERR", e));
  s.on("trade:error", e => console.log(name, "TRADE ERR", e));
};

mk(TOKEN_A, "A", true);
mk(TOKEN_B, "B", false);