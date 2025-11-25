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
      <h1 className="text-2xl font-bold mb-4">Chat</h1>

      <div className="border rounded p-4 h-80 overflow-y-auto bg-gray-50 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded ${
              msg.type === "connect"
                ? "text-green-600 text-center"
                : msg.type === "disconnect"
                ? "text-red-600 text-center"
                : "bg-gray-200 text-gray-800 text-left"
            }`}
          >
            {msg.type === "chat" ? msg.text : <em>{msg.text}</em>}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écris ton message..."
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Envoyer
        </button>
      </form>
      <Waveform audioUrl="/content/musics/anime/SAO.mp3" /> 
    </div>
  );
}
