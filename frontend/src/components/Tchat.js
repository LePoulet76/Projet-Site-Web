import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

export default function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null); // defillement automatique
  const [socket, setSocket] = useState(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); //defillement vers le bas (option smooth pour une dessente trnanquille)
  };

  useEffect(() => {
    const newSocket = io("http://localhost:3000"); 
    setSocket(newSocket);}, []);

  useEffect(() => { // scroll à chaque nouveau message
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return; // dodo si le socket n'est pas dispo

    const handleChatMessage = (msg) => {
      setMessages((prev) => [...prev, { text: msg, type: "chat" }]);
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
  }, [socket]); // on relance l'effet si le socket change

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && socket) {
      socket.emit("chat message", input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full border rounded bg-gray-50">
      {}//ZONE MESSAGES A REFAIRE 
      <div className="flex-1 p-4 overflow-y-auto h-80">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded max-w-[80%] ${
              msg.type === "connect"
                ? "text-green-600 text-center text-xs w-full"
                : msg.type === "disconnect"
                ? "text-red-600 text-center text-xs w-full"
                : "bg-white border text-gray-800 self-start shadow-sm"
            }`}
          >
            {msg.type === "chat" ? msg.text : <em>{msg.text}</em>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {} //ZONE INPUT MESSAGE
      <form onSubmit={sendMessage} className="p-4 border-t bg-white flex gap-2">
        <input
          className="flex-1 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écris ton message..."
        />
        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}