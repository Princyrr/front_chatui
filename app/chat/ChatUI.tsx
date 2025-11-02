"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createConversation, sendMessage } from "./actions";

type Message = { role: string; text: string };

export default function ChatUI() {
  const [convId, setConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const conv = await createConversation();
      setConvId(conv._id);
    };
    init();
  }, []);

  const handleSend = async () => {
    if (!convId || !input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const { reply } = await sendMessage(convId, input);
    const aiMsg = { role: "assistant", text: reply };
    setMessages((prev) => [...prev, aiMsg]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-orange-100 to-yellow-50 p-6">
      {/* Header */}
      <header className="text-center mb-8 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={60}
            height={60}
            className="rounded-full shadow-lg"
          />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent drop-shadow-md">
            Agente de IA
          </h1>
        </div>
        <p className="text-gray-600 text-sm font-medium">
          Converse com seu assistente inteligente
        </p>
      </header>

      {/* Chat messages area */}
      <div className="flex-1 overflow-auto p-5 rounded-2xl shadow-xl border-2 border-transparent bg-white/70 backdrop-blur-md relative"
           style={{ backgroundImage: 'linear-gradient(to right, rgba(255,165,0,0.05), rgba(255,223,0,0.05))' }}>
        {messages.length === 0 && (
          <p className="text-center text-gray-400 italic animate-pulse">
            Comece a conversa digitando abaixo 👇
          </p>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-end gap-3 mb-3 transition-opacity duration-500 ease-in-out ${
              m.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            {/* Logo da IA */}
            {m.role === "assistant" && (
              <Image
                src="/logo.png"
                alt="IA"
                width={40}
                height={40}
                className="rounded-full shadow-lg ring-2 ring-orange-300"
              />
            )}

            <div
              className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-lg break-words transform transition-all duration-300 
                ${m.role === "assistant"
                  ? "bg-gradient-to-r from-orange-100 to-yellow-50 text-orange-900 rounded-bl-none hover:scale-105"
                  : "bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-br-none hover:scale-105"
                }`}
              style={{ animation: 'fadeIn 0.5s ease forwards' }}
            >
              <span className="block text-sm leading-relaxed whitespace-pre-wrap">
                {m.text}
              </span>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-5 flex items-center gap-3">
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-3 rounded-xl border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm text-gray-700 transition-all duration-300 hover:shadow-md"
        />
        <button
          onClick={handleSend}
          className="bg-gradient-to-r from-orange-500 to-amber-600 hover:opacity-95 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
        >
          Enviar
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
