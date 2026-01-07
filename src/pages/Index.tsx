import { useState } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { AppHeader } from "@/components/layout/AppHeader";
import { ChatView } from "@/components/views/ChatView";
import { StatsView } from "@/components/views/StatsView";
import { RecurringView } from "@/components/views/RecurringView";
import { HistoryView } from "@/components/views/HistoryView";

const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const monthlyTotal = 0; // Mock data - will be calculated from expenses

  return (
    <div className="h-screen bg-background flex flex-col">
      <AppHeader monthlyTotal={monthlyTotal} />
      
      <div className="flex-1 overflow-hidden pb-16">
        {activeTab === "chat" && <ChatView />}
        {activeTab === "stats" && <StatsView />}
        {activeTab === "recurring" && <RecurringView />}
        {activeTab === "history" && <HistoryView />}
      </div>
      
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
