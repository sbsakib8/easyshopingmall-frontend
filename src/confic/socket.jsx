let socket;

if (typeof window !== "undefined") {
  const { io } = require("socket.io-client");
  socket = io("https://easyshoppingmallbd.com", {
    transports: ["websocket", "polling"],
  });
}

export default socket;