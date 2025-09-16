import { useState } from "react";
import "./App.css";

export default function ChatConsole({ messages, setMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // add user message immediately
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // call backend instead of OpenAI directly
      const resp = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await resp.json();

      // extract AI reply from backend response
      const aiReply = data.choices?.[0]?.message?.content || "⚠️ No response";

      setMessages([...newMessages, { sender: "ai", text: aiReply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { sender: "ai", text: "⚠️ Error connecting to backend" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Chat messages */}
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "user-msg" : "ai-msg"}
          >
            {msg.text}
          </div>
        ))}

        {loading && <div className="ai-msg">AI is typing…</div>}
      </div>

      {/* Input bar */}
      <div className="input-bar">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
