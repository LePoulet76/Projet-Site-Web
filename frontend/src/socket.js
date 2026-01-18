import { io } from "socket.io-client";

export const socket = io("http://localhost:3001", {
    transports: ["websocket"], 
    reconnectionAttempts: 0,
    autoConnect: false
});
