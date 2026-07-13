"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X } from "lucide-react";

const replies = [
  "I can help with network design, cloud systems, security and custom software. What are you building?",
  "For ISP or enterprise infrastructure, start with a discovery call — I'll map architecture and risks.",
  "Yes — AI automation with n8n and custom APIs is available. Share your workflow goals.",
];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    {
      role: "bot",
      text: "Hi — I'm Recep's AI assistant. Ask about infrastructure, projects, or availability.",
    },
  ]);

  const send = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput("");
    setMessages((m) => [
      ...m,
      { role: "user", text: userText },
      { role: "bot", text: replies[Math.floor(Math.random() * replies.length)] },
    ]);
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary shadow-glow"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Open AI assistant"
      >
        <Bot size={22} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="fixed bottom-24 right-6 z-40 flex h-[420px] w-[min(100vw-2rem,360px)] flex-col overflow-hidden rounded-3xl glass-strong"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-sm font-medium">AI Assistant</p>
                <p className="text-xs text-muted">Always-on guidance</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant">
                <X size={18} className="text-muted" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === "bot"
                      ? "bg-white/5 text-white"
                      : "ml-auto bg-primary/30 text-white"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t border-white/10 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask anything..."
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none focus:border-accent/40"
              />
              <button
                type="button"
                onClick={send}
                className="rounded-full bg-accent/20 p-2 text-accent"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
