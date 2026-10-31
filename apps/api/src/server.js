import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/database.js";
import initSocket from "./socket/index.js";
import { startFeed } from "./services/priceFeed.js";
import { startMatchmaking } from "./services/matchmaking.js";

await connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: env.CLIENT_URL, credentials: true },
});
app.set("io", io);

initSocket(io);
startFeed();
startMatchmaking(io);

server.listen(env.PORT, () => {
  console.log(`ChartWars API listening at http://127.0.0.1:${env.PORT}`);
});