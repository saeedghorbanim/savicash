import { ShoppingBag, Utensils, Car, Zap, Film, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
  { id: 1, name: "Whole Foods Market", category: "Food & Dining", amount: -67.50, date: "Today", icon: Utensils },
  { id: 2, name: "Uber", category: "Transportation", amount: -24.00, date: "Today", icon: Car },
  { id: 3, name: "Netflix", category: "Entertainment", amount: -15.99, date: "Yesterday", icon: Film },
  { id: 4, name: "Amazon", category: "Shopping", amount: -89.99, date: "Yesterday", icon: ShoppingBag },
  { id: 5, name: "Electric Bill", category: "Bills & Utilities", amount: -142.00, date: "Jan 5", icon: Zap },
  { id: 6, name: "Paycheck", category: "Income", amount: 3200.00, date: "Jan 1", icon: MoreHorizontal },
];

export function TransactionList() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold font-display">Recent Transactions</h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          View all
        </button>
      </div>
      
      <div className="space-y-4">
        {transactions.map((transaction, index) => {
          const Icon = transaction.icon;
          const isPositive = transaction.amount > 0;
          
          return (
            <div 
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2.5 rounded-lg",
                  isPositive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">{transaction.name}</p>
                  <p className="text-sm text-muted-foreground">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-semibold",
                  isPositive ? "text-success" : "text-foreground"
                )}>
                  {isPositive ? "+" : ""}{transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
