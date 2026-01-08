import { useState, useRef, useEffect } from "react";
import { Send, Camera, Mic, MicOff, Loader2, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { BudgetTracker } from "@/components/budget/BudgetTracker";
import { useLocalStorage, BudgetLimit } from "@/hooks/useLocalStorage";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  image?: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const ANALYZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-receipt`;

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hi! I'm SaviCash, your friendly budget buddy! 💰 Just tell me what you spent and I'll help you track it. You can type, use voice 🎤, or snap a photo of your receipt 📸!",
    role: "assistant",
    timestamp: new Date(),
  },
];

// Parse expense from AI response
function parseExpenseFromResponse(text: string): { amount: number; description: string; category: string } | null {
  const regex = /\[EXPENSE:([\d.]+):([^:]+):([^\]]+)\]/;
  const match = text.match(regex);
  
  if (match) {
    return {
      amount: parseFloat(match[1]),
      description: match[2].trim(),
      category: match[3].trim(),
    };
  }
  return null;
}

export const ChatView = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const { budget, addExpense, setBudgetLimit } = useLocalStorage();

  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording({
    onTranscription: (text) => {
      setInput(text);
      toast({
        title: "Got it! 🎤",
        description: "Your voice has been transcribed",
      });
    },
    onError: (error) => {
      toast({
        title: "Voice Error",
        description: error,
        variant: "destructive",
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeReceipt = async (imageData: string) => {
    setIsAnalyzingImage(true);
    try {
      const response = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze receipt");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Receipt analysis error:", error);
      throw error;
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    let messageContent = input;
    let receiptData = null;

    // If there's an image, analyze it first
    if (selectedImage) {
      try {
        receiptData = await analyzeReceipt(selectedImage);
        if (receiptData.total) {
          messageContent = `I just uploaded a receipt from ${receiptData.store || 'a store'}. Total: $${receiptData.total}${receiptData.category ? ` (${receiptData.category})` : ''}. ${input}`.trim();
          
          // Save the expense from receipt locally
          addExpense({
            description: receiptData.store || 'Receipt',
            amount: parseFloat(receiptData.total),
            category: receiptData.category || 'shopping',
            store: receiptData.store || null,
          });
        } else if (receiptData.raw) {
          messageContent = `I uploaded a receipt image. Here's what was found: ${receiptData.raw}. ${input}`.trim();
        }
      } catch {
        toast({
          title: "Couldn't read receipt",
          description: "I'll still try to help! Just tell me the details.",
          variant: "destructive",
        });
        messageContent = input || "I tried to upload a receipt but it couldn't be read.";
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      role: "user",
      timestamp: new Date(),
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    let assistantContent = "";
    let fullResponseForParsing = "";

    const upsertAssistant = (chunk: string) => {
      assistantContent += chunk;
      fullResponseForParsing += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.id.startsWith("stream-")) {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [
          ...prev,
          {
            id: `stream-${Date.now()}`,
            content: assistantContent,
            role: "assistant" as const,
            timestamp: new Date(),
          },
        ];
      });
    };

    try {
      const chatMessages = messages
        .slice(1)
        .concat(userMessage)
        .map((m) => ({ role: m.role, content: m.content }));

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: chatMessages }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to start stream");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // After streaming, check for expense tags and save locally
      const expense = parseExpenseFromResponse(fullResponseForParsing);
      if (expense && !receiptData) {
        addExpense({
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          store: null,
        });
        toast({
          title: "Expense saved! 💰",
          description: `$${expense.amount.toFixed(2)} for ${expense.description}`,
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Budget Tracker */}
      <div className="p-4 pb-2">
        <BudgetTracker budget={budget} onSetBudget={setBudgetLimit} />
      </div>

      {/* AI Introduction Card */}
      <div className="px-4 pb-2">
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
              {message.image && (
                <img 
                  src={message.image} 
                  alt="Receipt" 
                  className="max-w-full h-auto rounded-lg mb-2 max-h-32 object-cover"
                />
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-card text-foreground border border-border rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected Image Preview */}
      {selectedImage && (
        <div className="px-4 py-2">
          <div className="relative inline-block">
            <img 
              src={selectedImage} 
              alt="Selected receipt" 
              className="h-20 w-auto rounded-lg border border-border"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isAnalyzingImage}
            className={cn(
              "w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center transition-colors",
              selectedImage 
                ? "text-primary border-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isAnalyzingImage ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : selectedImage ? (
              <Image className="w-5 h-5" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 flex items-center bg-card border border-border rounded-full px-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRecording ? "Listening..." : "Type or speak..."}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 px-0"
              disabled={isLoading || isRecording}
            />
            <button
              type="button"
              onClick={handleMicClick}
              disabled={isLoading || isProcessing}
              className={cn(
                "transition-colors p-1",
                isRecording 
                  ? "text-destructive animate-pulse" 
                  : isProcessing 
                    ? "text-muted-foreground" 
                    : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            size="icon"
            className="w-10 h-10 rounded-full shrink-0 shadow-md"
            disabled={isLoading || isRecording || isProcessing}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
