import WebSocket from "ws";

let price = 60000;
let lastTick = 0;
const history = []; // { t, p } har second ka price

export function startFeed(symbol = "btcusdt") {
  const connect = () => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);
    ws.on("message", (d) => {
      price = parseFloat(JSON.parse(d).p);
      lastTick = Date.now();
    });
    ws.on("close", () => setTimeout(connect, 2000));
    ws.on("error", () => ws.close());
  };
  connect();

  setInterval(() => {
    // Binance 5 sec se chup ho to simulated random walk
    if (Date.now() - lastTick > 5000) price *= 1 + (Math.random() - 0.5) * 0.0006;
    history.push({ t: Date.now(), p: price });
    if (history.length > 900) history.shift();
  }, 1000);
}

export const getPrice = () => price;
export const getHistory = () => history.slice(-600);