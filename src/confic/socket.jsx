import { UrlBackend } from "./urlExport";

let socket;

if (typeof window !== "undefined") {
  const { io } = require("socket.io-client");
  const socketUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    (UrlBackend ? UrlBackend.replace(/\/api\/?$/, "") : "https://api.easyshoppingmallbd.com");

  socket = io(socketUrl, {
    transports: ["websocket", "polling"],
  });
}

export default socket;