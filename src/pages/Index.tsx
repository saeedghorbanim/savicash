import { useState, useEffect } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { AppHeader } from "@/components/layout/AppHeader";
import { ChatView } from "@/components/views/ChatView";
import { StatsView } from "@/components/views/StatsView";
import { RecurringView } from "@/components/views/RecurringView";
import { HistoryView } from "@/components/views/HistoryView";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAppUsage, FREE_USAGE_LIMIT } from "@/hooks/useAppUsage";
import { SubscriptionPaywall } from "@/components/subscription/SubscriptionPaywall";

const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [showPaywall, setShowPaywall] = useState(false);
  const { expenses, budget, deleteExpense, addExpense, setBudgetLimit, saveBudget } = useLocalStorage();
  const { 
    usageData, 
    subscription, 
    isLoading: usageLoading,
    incrementUsage, 
    hasExceededFreeUsage, 
    setSubscriptionActive 
  } = useAppUsage();

  // Check paywall status on load and when usage changes
  useEffect(() => {
    if (!usageLoading && hasExceededFreeUsage()) {
      setShowPaywall(true);
    }
  }, [usageLoading, usageData.usageCount, subscription.isSubscribed]);

  // Check if user should see paywall BEFORE performing an action
  const shouldShowPaywall = () => {
    // User has already used their free limit and is not subscribed
    return usageData.usageCount >= FREE_USAGE_LIMIT && !subscription.isSubscribed;
  };

  // Wrapped addExpense that tracks usage
  const handleAddExpense = (expense: Parameters<typeof addExpense>[0]) => {
    // Check BEFORE adding if they've exceeded the limit
    if (shouldShowPaywall()) {
      setShowPaywall(true);
      // Still add the expense but show paywall after
      const result = addExpense(expense);
      incrementUsage();
      return result;
    }
    
    const result = addExpense(expense);
    incrementUsage();
    
    // Check if this expense puts them at the limit (for next time)
    // The paywall will show on their NEXT action
    return result;
  };

  // Handle successful subscription
  const handleSubscriptionSuccess = () => {
    setSubscriptionActive('savicash_monthly_299');
    setShowPaywall(false);
  };
  
  // Calculate monthly total from current month's expenses
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlyTotal = expenses
    .filter((e) => {
      const date = new Date(e.created_at);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  // Show seamless loading state while checking usage (matches paywall background)
  if (usageLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-background to-muted/30" />
    );
  }

  // Show paywall if user has exceeded free usage
  if (showPaywall) {
    return (
      <SubscriptionPaywall 
        onSubscriptionSuccess={handleSubscriptionSuccess}
        usageCount={usageData.usageCount}
      />
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <AppHeader monthlyTotal={monthlyTotal} />
      
      <div className="flex-1 overflow-hidden pb-20">
        {activeTab === "chat" && (
          <ChatView 
            budget={budget}
            onAddExpense={handleAddExpense}
            onSetBudgetLimit={setBudgetLimit}
          />
        )}
        {activeTab === "stats" && <StatsView expenses={expenses} />}
        {activeTab === "recurring" && <RecurringView expenses={expenses} />}
        {activeTab === "history" && <HistoryView expenses={expenses} onDeleteExpense={deleteExpense} />}
      </div>
      
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
