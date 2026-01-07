import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { AIAssistant } from "@/components/dashboard/AIAssistant";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 gradient-glow pointer-events-none" />
      
      <Header />
      
      <main className="container mx-auto px-6 py-8 relative">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display mb-2">
            Good morning, <span className="text-gradient">John</span>
          </h1>
          <p className="text-muted-foreground">
            Here's your financial overview for January 2024
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Balance"
            value="$12,450"
            change="+2.5% from last month"
            changeType="positive"
            icon={<Wallet className="w-5 h-5" />}
          />
          <StatCard
            title="Monthly Income"
            value="$5,200"
            change="+$400 vs last month"
            changeType="positive"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatCard
            title="Monthly Spending"
            value="$1,900"
            change="-12% vs last month"
            changeType="positive"
            icon={<TrendingDown className="w-5 h-5" />}
          />
          <StatCard
            title="Savings Goal"
            value="68%"
            change="$3,400 of $5,000"
            changeType="neutral"
            icon={<PiggyBank className="w-5 h-5" />}
          />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <SpendingChart />
            <TransactionList />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <BudgetProgress />
            <AIAssistant />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
