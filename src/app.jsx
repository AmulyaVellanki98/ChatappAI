import { useState } from "react";
import { FiEdit2, FiSearch } from "react-icons/fi"; // icons
import ChatConsole from "./chatconsole";
import "./App.css";

function App() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState({
    id: Date.now(),
    title: "Untitled Chat",
    messages: [],
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Start a new chat
  const newChat = () => {
    if (activeChat.messages.length > 0) {
      setConversations([...conversations, activeChat]); // save current chat
    }
    setActiveChat({ id: Date.now(), title: "Untitled Chat", messages: [] });
  };

  // Filtered conversations
  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Chats</h2> {/* changed heading */}

        {/* New Chat button */}
        <button className="new-chat-btn" onClick={newChat}>
          <FiEdit2 className="btn-icon" /> New Chat
        </button>

        {/* Search bar */}
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Chat history list */}
        <div className="chat-history">
          {filteredConversations.map((c) => (
            <div
              key={c.id}
              className={`history-item ${c.id === activeChat.id ? "active" : ""}`}
              onClick={() => setActiveChat(c)}
            >
              {c.title}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Console */}
      <ChatConsole
        messages={activeChat.messages}
        setMessages={(updatedMessages) => {
          const firstUserMsg = updatedMessages.find((m) => m.sender === "user");
          setActiveChat({
            ...activeChat,
            title: firstUserMsg
              ? firstUserMsg.text.slice(0, 25)
              : "Untitled Chat",
            messages: updatedMessages,
          });
        }}
      />
    </div>
  );
}

export default App;
