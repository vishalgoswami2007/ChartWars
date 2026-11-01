import { io } from "socket.io-client";
import { refreshSession } from "../pages/auth/AuthProvider";

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, // login ke baad hi connect hoga
});

let retried = false;

socket.on("connect", () => {
  retried = false;
  console.log("socket connected");
});

socket.on("connect_error", async (e) => {
  console.log("socket error:", e.message);
  // Access token expire hua ho to ek baar refresh karke dobara connect
  if (e.message === "unauthorized" && !retried) {
    retried = true;
    if (await refreshSession()) socket.connect();
  }
});