import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

// On gère les événements Socket.IO
io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté :", socket.id);

  // Message système : connexion
  socket.broadcast.emit("system message", {
    text: `Un utilisateur s'est connecté`,
    type: "connect",
  });

  // Message de chat reçu
  socket.on("chat message", (msg) => {
    console.log("Message reçu :", msg);
    socket.broadcast.emit("chat message", msg);
  });

  // Déconnexion
  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté :", socket.id);
    socket.broadcast.emit("system message", {
      text: `Un utilisateur s'est déconnecté`,
      type: "disconnect",
    });
  });
});

const PORT = 3001;
server.listen(PORT, () =>
  console.log(`Serveur live en ligne http://localhost:${PORT}`)
);
