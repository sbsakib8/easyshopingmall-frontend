import { io } from "socket.io-client";
const socket = io("https://easyshoppingmallbd.com", {
  transports: ["websocket"], 
});
export default socket;