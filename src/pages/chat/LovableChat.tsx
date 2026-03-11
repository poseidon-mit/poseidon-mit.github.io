import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "ai";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "What's my net worth?",
  "Any threats I should know about?",
  "How much did I spend on dining?",
  "Show me savings opportunities",
];

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("net worth")) {
    return "Your current net worth is $94,040.77, spread across 7 accounts. Your total assets are $97,272.09 with $3,231.32 in liabilities (credit cards). Your portfolio is up 7.8% YTD.";
  }
  if (lower.includes("threat")) {
    return "I've detected 2 high-severity threats from Oslo, Norway. An unusual login at 3:42 AM and a $234.50 purchase at Oslo Electronics. I recommend reviewing these immediately in the Protect engine.";
  }
  if (lower.includes("dining") || lower.includes("food") || lower.includes("spend")) {
    return "You spent $2,890.45 on Food & Dining in February, which is 14.5% of your monthly spending. This is slightly above your 3-month average of $2,650.";
  }
  if (lower.includes("saving")) {
    return "I've identified $2,437/year in potential savings: $269.40 from moving idle cash to high-yield savings, $468 from canceling duplicate subscriptions, $96-192 from optimizing credit card rewards, and $399.60 from tax-loss harvesting.";
  }
  if (lower.includes("pending") || lower.includes("action")) {
    return "You have 3 pending actions requiring approval: 1) Tax-Loss Harvest VTI (save $399.60), 2) Monthly $500 transfer to savings, 3) Adobe duplicate refund dispute ($59.99).";
  }
  return "I can help with your accounts, threats, savings, and pending actions. Try asking about one of these topics.";
}

export default function LovableChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = { role: "ai", content: getAIResponse(text) };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!hasMessages ? (
          <motion.div
            className="flex flex-col items-center justify-center h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <span className="text-5xl mb-4 drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">{"\uD83D\uDD31"}</span>
            <h2 className="text-xl font-bold text-white mb-2">
              Ask Poseidon anything about your finances
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 w-full max-w-md">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.08] p-3 text-left text-sm text-white/60 cursor-pointer hover:bg-white/[0.08] hover:border-white/[0.12] hover:text-white/80 transition-all duration-200 min-h-[44px]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <>
            {messages.map((msg, i) =>
              msg.role === "user" ? (
                <motion.div
                  key={i}
                  className="flex justify-end"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="ml-auto bg-cyan-500 text-white rounded-2xl rounded-br-md px-4 py-2 max-w-[80%] shadow-lg shadow-cyan-500/20">
                    {msg.content}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={i}
                  className="flex justify-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="mr-auto bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-2xl rounded-bl-md px-4 py-2 max-w-[80%] text-white/90">
                    {msg.content}
                  </div>
                </motion.div>
              ),
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="mr-auto bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-2xl rounded-bl-md px-4 py-2 text-white/30">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 bg-[#0d1526]/90 backdrop-blur-xl border-t border-white/[0.06] p-3 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your finances..."
          className="flex-1 bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2 min-h-[44px] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-white rounded-xl px-4 min-h-[44px] shadow-lg shadow-cyan-500/25 transition-all duration-200"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
