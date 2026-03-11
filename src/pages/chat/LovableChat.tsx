import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

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
    return "Your current net worth is $902,753.52, spread across 11 accounts. Your total assets are $909,802.27 with $7,048.75 in liabilities (credit cards). Your portfolio is up 7.8% YTD.";
  }
  if (lower.includes("threat")) {
    return "I've detected 2 high-severity threats from Oslo, Norway. An unusual login at 3:42 AM and a $734.50 purchase at Oslo Electronics. I recommend reviewing these immediately in the Protect engine.";
  }
  if (lower.includes("dining") || lower.includes("food") || lower.includes("spend")) {
    return "You spent $2,890.45 on Food & Dining in February, which is 14.5% of your monthly spending. This is slightly above your 3-month average of $2,650.";
  }
  if (lower.includes("saving")) {
    return "I've identified $3,601/year in potential savings: $831 from moving idle cash to HYSA, $1,320 from reviewing your Equinox membership, $600 from maximizing 529 contributions, and $850/year recurring from tax-loss harvesting (plus $1,065.60 already realized this year).";
  }
  if (lower.includes("pending") || lower.includes("action")) {
    return "You have 3 pending actions requiring approval: 1) Tax-Loss Harvest VTI (save $1,443), 2) Monthly $2,000 transfer to Marcus HYSA, 3) Adobe duplicate refund dispute ($59.99).";
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
    <div className="flex flex-col h-[calc(100vh-140px)] bg-[#ECEAE5]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-5xl mb-4">{"\uD83D\uDD31"}</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Ask Poseidon anything about your finances
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 w-full max-w-md">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="bg-white rounded-xl border p-3 text-left text-sm text-gray-700 cursor-pointer hover:shadow-md transition min-h-[44px]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) =>
              msg.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="ml-auto bg-cyan-500 text-white rounded-2xl rounded-br-md px-4 py-2 max-w-[80%]">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <div className="mr-auto bg-white border rounded-2xl rounded-bl-md px-4 py-2 max-w-[80%] text-gray-900">
                    {msg.content}
                  </div>
                </div>
              ),
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="mr-auto bg-white border rounded-2xl rounded-bl-md px-4 py-2 text-gray-400">
                  Typing...
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
        className="sticky bottom-0 bg-white border-t p-3 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your finances..."
          className="flex-1 border rounded-xl px-4 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white rounded-xl px-4 min-h-[44px] transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
