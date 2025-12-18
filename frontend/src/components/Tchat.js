import { useState, useEffect, useRef } from "react";

export default function ChatComponent({socket}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null); // defillement automatique
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); //defillement vers le bas (option smooth pour une dessente trnanquille)
  };
  
  useEffect(() => { // scroll à chaque nouveau message
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleChatMessage = (msg) => {
      setMessages((prev) => [...prev, { text: msg, type: "chat message" }]);
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
      setMessages((prev) => [...prev, { text: input, type: "chat" }]);
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
            className={`mb-2 p-2 rounded ${msg.type === "connect"
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
    </div>
  );
}