import WebSocket from "ws";

let price = 60000, lastTick = 0;

export function startFeed(symbol = "btcusdt") {
  const connect = () => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);
    ws.on("message", (d) => { price = parseFloat(JSON.parse(d).p); lastTick = Date.now(); });
    ws.on("close", () => setTimeout(connect, 2000));
    ws.on("error", () => ws.close());
  };
  connect();
  setInterval(() => {
    if (Date.now() - lastTick > 5000) price *= 1 + (Math.random() - 0.5) * 0.0006;
  }, 1000);
}

export const getPrice = () => price;