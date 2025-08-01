import React, { useState, useRef, useEffect } from "react";
import {
  HomeIcon,
  BookmarkIcon,
  ArrowUpCircleIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Ref for auto-scroll
  const messagesEndRef = useRef(null);

  // ✅ Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setInput("");
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        }
      );
      const data = await response.json();
      const botReply =
        data.choices?.[0]?.message?.content || "Sorry, no response.";
      setMessages([...newMessages, { role: "assistant", content: botReply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error communicating with OpenAI." },
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-gray-800">
        {/* 🔹 Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-gray-900 p-3 border-b border-gray-700">
          <img src="./chatGpt.png" alt="ChatGpt" className="w-28" />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white p-2 rounded-lg hover:bg-gray-700 transition"
          >
            {isSidebarOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* 🔹 Sidebar */}
        <div
          className={`fixed md:static top-0 left-0 h-full md:h-auto bg-gray-800 w-70 md:w-70 text-white flex flex-col justify-between p-4 border-r border-gray-700 transform transition-transform duration-300 z-50 
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          {/* Top Section */}
          <div className="hidden md:flex justify-center items-center">
            <img
              src="./chatGpt.png"
              alt="ChatGpt"
              className="w-[80%] mx-auto"
            />
          </div>

          <ul className="space-y-4 mt-6 md:mt-8 w-full">
            <li>
              <button className="w-full text-white bg-[#5856ff] font-medium rounded text-sm py-3 text-center inline-flex items-center justify-center space-x-2 hover:bg-[#4744f4] cursor-pointer transition">
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 5v14m-7-7h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>New Chat</span>
              </button>
            </li>

            <li>
              <button className="w-full text-white font-medium rounded text-sm py-3 border border-white text-center hover:bg-[#5856ff] hover:border-[#5856ff] cursor-pointer transition">
                What is programming
              </button>
            </li>

            <li>
              <button className="w-full text-white font-medium rounded text-sm py-3 border border-white text-center hover:bg-[#5856ff] hover:border-[#5856ff] cursor-pointer transition">
                How to Use API?
              </button>
            </li>
          </ul>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-4 mt-4">
            <ul className="space-y-3 text-sm md:text-base">
              <li className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded cursor-pointer transition">
                <HomeIcon className="w-5 h-5 text-white" /> Home
              </li>
              <li className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded cursor-pointer transition">
                <BookmarkIcon className="w-5 h-5 text-white" /> Saved
              </li>
              <li className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded cursor-pointer transition">
                <ArrowUpCircleIcon className="w-5 h-5 text-white" /> Upgrade to
                Pro
              </li>
            </ul>
          </div>
        </div>

        {/* ✅ Main Content */}
        <div className="flex-1 bg-gray-900 flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "justify-end" : ""
                }`}
              >
                {msg.role === "assistant" && (
                  <img
                    src="./AiLogo.png"
                    alt="Bot"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  />
                )}
                <div
                  className={`p-2 sm:p-3 rounded-lg shadow max-w-[85%] sm:max-w-md ${
                    msg.role === "assistant"
                      ? "bg-blue-700 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <img
                    src="./UserProfile.jpg"
                    alt="User"
                    className="w-10 h-10 sm:w-10 sm:h-10 rounded-full object-cover order-1 md:order-none"
                  />
                )}
              </div>
            ))}

            {/* ✅ This element ensures scroll goes to bottom */}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Footer */}
          <div className="border-t border-gray-700 bg-gray-800 p-2 sm:p-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#5856ff] transition"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !loading) {
                  sendMessage(e);
                }
              }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-gray-700 p-2 sm:p-3 rounded-lg flex items-center justify-center 
              hover:bg-gray-600 active:bg-gray-500 transition-colors duration-200 shadow-md"
            >
              <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white rotate-45" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
