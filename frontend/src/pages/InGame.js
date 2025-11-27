import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Waveform from "../components/Waveform";

const socket = io("http://localhost:3001");


/*
Logique jeu :
Point : 5, 3, 1
*/
// initialGameState = 
// {
//   phase : "LOBBY",
//   player : [,],
//   round : 0,
// }
export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Messages utilisateur
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, { text: msg, type: "chat" }]);
    });

    // Messages système (connexion / déconnexion)
    socket.on("system message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat message");
      socket.off("system message");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit("chat message", input);
      setInput("");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <Tchat socket={socket} />
      <Waveform audioUrl="/content/musics/anime/SAO.mp3" /> 
    </div>
  );
}
