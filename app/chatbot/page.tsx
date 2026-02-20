"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";

export default function ChatbotPage() {
  const [chatInput, setChatInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    api: "/api/chat",
  });

  const isBusy = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isBusy]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isBusy) return;
  
    // Sending as an object so the backend logs 'User Message: content'
    await sendMessage({ text: chatInput }); 
    setChatInput(""); 
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 md:p-8 bg-white selection:bg-emerald-100">
      {/* Header Section */}
      <header className="flex items-center justify-between pb-6 border-b border-gray-100 mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            Carisma <span className="text-emerald-500">AI</span>
          </h1>
          <p className="text-sm text-gray-500 font-medium">Auto Shop Management Assistant</p>
        </div>
        <div className="hidden md:block">
          <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full uppercase tracking-widest font-bold border border-gray-200">
            Enterprise v5.0
          </span>
        </div>
      </header>

      {/* Main Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 text-2xl">✨</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Ready to assist, Boss.</h3>
              <p className="text-sm text-gray-500 max-w-xs">Ask me about shop inventory or schedules.</p>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] md:max-w-[70%] rounded-3xl px-5 py-3 shadow-sm ${
              m.role === "user" ? "bg-emerald-600 text-white rounded-tr-none" : "bg-gray-100 border border-gray-200 text-gray-800 rounded-tl-none"
            }`}>
              <span className={`text-[9px] uppercase font-bold tracking-tighter mb-1 block opacity-50 ${m.role === "user" ? "text-right" : "text-left"}`}>
                {m.role === "user" ? "Shop Owner" : "Carisma AI"}
              </span>
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                {/* Logic to handle parts correctly */}
                {m.parts?.map((part, i) => {
                  if (part.type === 'text') {
                    return <span key={i}>{part.text}</span>;
                  }
                  if (part.type === 'tool-invocation') {
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs font-mono text-emerald-600 bg-emerald-50/50 p-2 rounded-lg my-2 border border-emerald-100">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Querying Inventory...
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Global Loading State */}
        {isBusy && (
          <div className="flex justify-start">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-none px-5 py-3 flex gap-1 items-center shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="pt-6">
        <form onSubmit={handleFormSubmit} className="relative bg-gray-50 rounded-3xl p-2 border border-gray-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all duration-200">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="w-full bg-transparent border-none px-6 py-4 outline-none text-gray-800 placeholder:text-gray-400"
            placeholder="Search BMW, Audi, or total inventory..."
          />
          <button
            type="submit"
            disabled={isBusy || !chatInput.trim()}
            className="absolute right-3 top-3 h-12 w-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 disabled:bg-gray-100 disabled:text-gray-300 transition-all duration-200 active:scale-95 shadow-lg"
          >
            {isBusy ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            )}
          </button>
        </form>
        {error && (
          <div className="flex items-center gap-2 mt-3 ml-4">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <p className="text-red-500 text-[10px] uppercase font-bold tracking-tighter italic">
              {error.message.includes('quota') ? 'Quota Exceeded - Please wait a minute' : `Error: ${error.message}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}