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
  // CRITICAL: Read directly from localStorage to avoid stale React state on mobile
  const shouldShowPaywall = () => {
    if (subscription.isSubscribed) return false;
    
    // Read current count from localStorage to prevent stale state issues
    try {
      const stored = localStorage.getItem('savicash_app_usage');
      if (stored) {
        const parsed = JSON.parse(stored);
        const currentCount = typeof parsed.usageCount === 'number' ? parsed.usageCount : 0;
        return currentCount >= FREE_USAGE_LIMIT;
      }
    } catch {
      // Fall back to React state
    }
    return usageData.usageCount >= FREE_USAGE_LIMIT;
  };

  // Wrapped addExpense that tracks usage
  // IMPORTANT: when the free limit is exceeded, do NOT process the expense.
  // We must show the paywall immediately (pre-action) to avoid iOS “oops” flows.
  const handleAddExpense = (expense: Parameters<typeof addExpense>[0]) => {
    if (shouldShowPaywall()) {
      setShowPaywall(true);
      return;
    }

    addExpense(expense);
    incrementUsage();
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
