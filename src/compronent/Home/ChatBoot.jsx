"use client";

import React, { useState } from "react";
import { X, Send } from "lucide-react";
import { FaWhatsapp, FaFacebookMessenger, FaRobot } from "react-icons/fa";

const ChatBoot = () => {
  const [openAI, setOpenAI] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "ai", text: "👋 Hi! How can I help you today?" },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Dummy AI reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "🤖 Thanks for your message! I’ll reply soon." },
      ]);
    }, 800);
  };

  return (
    <>
      {/* Floating Icons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        {/* Messenger */}
        <a
          href="https://m.me/easyshoppingmall8"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 flex items-center justify-center rounded-full
          bg-white border-2 border-white shadow-lg hover:scale-110 transition-transform duration-300"
        >
          <FaFacebookMessenger className="text-blue-600 text-3xl" />
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/8801626420774"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 flex items-center justify-center rounded-full
          bg-white border-2 border-white shadow-lg hover:scale-110 transition-transform duration-300"
        >
          <FaWhatsapp className="text-green-500 text-3xl" />
        </a>

        {/* AI Chat */}
        <button
          onClick={() => setOpenAI(true)}
          className="w-14 h-14 flex items-center justify-center rounded-full
          bg-white border-2 border-white shadow-lg hover:scale-110 transition-transform duration-300"
        >
          <FaRobot className="text-indigo-600 text-3xl" />
        </button>
      </div>

      {/* AI Chat Box */}
      {openAI && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl
        z-50 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold">AI Assistant</span>
            <button onClick={() => setOpenAI(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[75%] px-3 py-2 rounded-lg break-words ${
                  msg.from === "user"
                    ? "ml-auto bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-indigo-600 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-indigo-600 rounded-lg text-sm focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-indigo-600 text-white px-3 rounded-lg flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBoot;
