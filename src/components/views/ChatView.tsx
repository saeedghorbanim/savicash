import { useState, useRef, useEffect } from "react";
import { Send, Camera, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hi! I am your AI budget assistant. Add expenses by typing, speaking, or uploading receipts. Try \"spent $45 on groceries\" or set a budget!",
    role: "assistant",
    timestamp: new Date(),
  },
];

export const ChatView = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Mock AI response
    setTimeout(() => {
      const responses = [
        "Got it! I've logged that expense for you. 📊\n\nLooking at your spending this week, you're doing great! You've stayed within your budget for food and entertainment. Keep up the mindful spending habits!",
        "Noted! That's a common expense I see in your history. 💡\n\nWould you like me to set this up as a recurring expense? It seems like you make this purchase regularly, and tracking it automatically could save you time.",
        "Added to your history! 📝\n\nI noticed you've spent about 15% more on food this month compared to last month. This isn't necessarily bad, but I wanted to keep you informed so you can adjust if needed.",
        "Tracked! 🎯\n\nYou're making excellent progress toward your savings goals! At this rate, you'll have an extra $200 saved by the end of the month. Keep it up with these smart spending decisions!",
        "I've recorded that expense! 💰\n\nQuick tip: Based on your spending patterns, I recommend setting aside about $50-75 each week for unexpected expenses. This could help you avoid any budget surprises.",
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* AI Introduction Card */}
      <div className="p-4">
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <p className="text-sm text-foreground leading-relaxed">
            {messages[0]?.content}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3">
        {messages.slice(1).map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground border border-border"
              )}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>
          
          <div className="flex-1 flex items-center bg-card border border-border rounded-full px-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or speak..."
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 px-0"
            />
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          
          <Button 
            type="submit" 
            size="icon" 
            className="w-10 h-10 rounded-full shrink-0 shadow-md"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
