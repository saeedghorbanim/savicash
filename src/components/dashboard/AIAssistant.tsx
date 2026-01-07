import { useState } from "react";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hi! I'm your AI budget assistant. Ask me anything about your spending, savings tips, or financial questions!"
  }
];

const suggestions = [
  "How can I save more this month?",
  "Am I overspending on dining?",
  "Predict my bills for next month",
  "What's my biggest expense category?"
];

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "How can I save more this month?": "Based on your spending patterns, I noticed you spend ~$450 on dining out. Try meal prepping 2-3 times a week - you could save around $150/month! Also, your Entertainment budget is over by $30. Consider pausing one subscription temporarily.",
        "Am I overspending on dining?": "Your dining expenses are at $450 this month, which is 75% of your $600 budget. You're on track! However, at this pace, you might exceed it by month-end. Consider cooking at home this weekend to stay within budget.",
        "Predict my bills for next month": "Based on your history: Electric ~$145 (+$3), Internet $79 (same), Phone $85 (same), Netflix $15.99. Total estimated: $325. Your electric bill tends to increase in winter months.",
        "What's my biggest expense category?": "Your biggest expense is Bills & Utilities at $520 (27% of spending), followed by Food & Dining at $450 (24%). Together they make up over half your monthly expenses."
      };
      
      const response = responses[input] || "I can help you analyze your spending, predict upcoming bills, suggest savings opportunities, and answer any money questions. What would you like to know?";
      
      const aiMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: response
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-card flex flex-col h-[500px]">
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="p-2 rounded-lg gradient-primary">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold font-display">AI Money Assistant</h3>
          <p className="text-xs text-muted-foreground">Ask me anything about your finances</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={cn(
              "flex gap-3 animate-fade-in",
              message.role === "user" && "flex-row-reverse"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg shrink-0",
              message.role === "assistant" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {message.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className={cn(
              "p-3 rounded-lg max-w-[80%]",
              message.role === "assistant" ? "bg-muted" : "gradient-primary text-primary-foreground"
            )}>
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 animate-fade-in">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-glow" />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-glow" style={{ animationDelay: "0.2s" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-glow" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestion(suggestion)}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your finances..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-muted border border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 text-sm transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 rounded-lg gradient-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
