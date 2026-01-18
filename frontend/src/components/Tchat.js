import { useState, useEffect, useRef } from "react";

export default function ChatComponent({socket,lobbyId}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null); // defillement automatique
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); //defillement vers le bas (option smooth pour une dessente trnanquille)
  };
  
  useEffect(() => { // scroll à chaque nouveau message
    scrollToBottom();
  }, [messages]);

  // UseEffect pour écouter les messages systeme et classiques
  useEffect(() => {
    const handleChatMessage = (msg) => {
      setMessages((prev) => [...prev, { 
          text: msg.text, 
          type: "chat message" 
      }]);
    };

    const handleSystemMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chat message", handleChatMessage);
    socket.on("system message", handleSystemMessage);

    return () => {
      socket.off("chat message", handleChatMessage);
      socket.off("system message", handleSystemMessage);
    };
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault(); //Pas de rechargement sinon on perd tout...
    const messageData = {
          lobbyId: lobbyId,
          text: input
      };
    if (input.trim() && socket) {
      socket.emit("chat message", messageData);
      setInput("");
    }
  };

  return (
  <div className="flex flex-col w-full">

      {/* CHAT BOX */}
      <div className="h-[260px] bg-white/40 border border-[#8c6558] rounded-t overflow-y-auto p-3 space-y-2 text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.type === "connect"
                ? "text-green-600 text-center"
                : msg.type === "disconnect"
                ? "text-red-600 text-center"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {msg.type === "chat" ? msg.text : <em>{msg.text}</em>}
          </div>
        ))}
      </div>

      {/* INPUT BAR */}
      <form
        onSubmit={sendMessage}
        className="flex gap-2 border border-t-0 border-[#8c6558] bg-pink-400 rounded-b p-2"
      >
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écris ton message..."
        />
        <button className="bg-white text-pink-500 font-bold px-4 rounded">
          Envoyer
        </button>
      </form>

    </div>
  );
}