import { useEffect, useRef, useState } from "react";
import { Bot, CalendarDays, MessageSquare, ReceiptText, Send, Sparkles, User, X } from "lucide-react";
import api from "../api/axios";

const prompts = [
  { label: "How many leaves do I have?", icon: CalendarDays },
  { label: "Show my salary details", icon: ReceiptText },
  { label: "Apply leave for tomorrow", icon: Sparkles },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi, I am your AI Employee Assistant. I can help with leave balances, salary details, and HR workflow questions.", isBot: true },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async (value) => {
    if (!value.trim()) return;

    const userMsg = value.trim();
    setMessages((prev) => [...prev, { text: userMsg, isBot: false }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", { message: userMsg });
      setMessages((prev) => [...prev, { text: data.answer, isBot: true }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, I am having trouble connecting right now. Please try again in a moment.", isBot: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <button
        aria-label="Open AI assistant"
        className={`${isOpen ? "hidden" : "flex"} fixed bottom-20 right-5 z-50 h-14 w-14 items-center justify-center rounded-full bg-secondary text-white shadow-soft transition hover:brightness-110 active:scale-95 lg:bottom-8 lg:right-8`}
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <section className="fixed inset-x-4 bottom-20 z-50 flex h-[min(620px,calc(100vh-7rem))] flex-col overflow-hidden rounded-xl border border-outline-variant bg-white shadow-soft sm:left-auto sm:right-6 sm:w-[420px] lg:bottom-8">
          <header className="flex items-center justify-between bg-primary-container px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Bot size={21} />
              </div>
              <div>
                <h2 className="font-black">AI Assistant</h2>
                <p className="text-xs text-slate-300">Grounded in your HR profile</p>
              </div>
            </div>
            <button className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white" onClick={() => setIsOpen(false)} type="button">
              <X size={19} />
            </button>
          </header>

          <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto bg-surface-container-low p-4">
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
              {prompts.map((prompt) => {
                const Icon = prompt.icon;
                return (
                  <button
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-outline-variant bg-white px-3 py-2 text-xs font-bold text-on-surface-variant transition hover:border-secondary hover:text-secondary"
                    disabled={loading}
                    key={prompt.label}
                    onClick={() => sendMessage(prompt.label)}
                    type="button"
                  >
                    <Icon size={14} />
                    {prompt.label}
                  </button>
                );
              })}
            </div>

            {messages.map((msg, index) => (
              <div className={`flex gap-3 ${msg.isBot ? "justify-start" : "justify-end"}`} key={`${msg.text}-${index}`}>
                {msg.isBot && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-container text-secondary">
                    <Bot size={17} />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    msg.isBot
                      ? "rounded-tl-none border border-outline-variant bg-white text-on-surface"
                      : "rounded-tr-none bg-primary text-white shadow-panel"
                  }`}
                >
                  {msg.text}
                </div>
                {!msg.isBot && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-container text-secondary">
                  <Bot size={17} />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-none border border-outline-variant bg-white px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-outline" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-outline [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-outline [animation-delay:240ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="border-t border-outline-variant bg-white p-4" onSubmit={handleSend}>
            <div className="relative">
              <input
                className="w-full rounded-2xl border border-outline-variant bg-surface-container-low py-4 pl-4 pr-14 text-sm outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10"
                disabled={loading}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your HR question..."
                type="text"
                value={input}
              />
              <button
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-secondary text-white transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading || !input.trim()}
                type="submit"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="mt-3 text-center text-[10px] font-black uppercase tracking-[0.16em] text-outline">
              Powered by HR Intellect AI Engine
            </p>
          </form>
        </section>
      )}
    </>
  );
};

export default Chatbot;
