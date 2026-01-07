import { cn } from "@/lib/utils";

const budgets = [
  { category: "Food & Dining", spent: 450, limit: 600, color: "bg-primary" },
  { category: "Shopping", spent: 320, limit: 400, color: "bg-accent" },
  { category: "Entertainment", spent: 180, limit: 150, color: "bg-destructive" },
  { category: "Transportation", spent: 280, limit: 350, color: "bg-success" },
];

export function BudgetProgress() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h3 className="text-lg font-semibold font-display mb-4">Budget Progress</h3>
      
      <div className="space-y-5">
        {budgets.map((budget, index) => {
          const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
          const isOverBudget = budget.spent > budget.limit;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{budget.category}</span>
                <span className={cn(
                  "font-medium",
                  isOverBudget ? "text-destructive" : "text-muted-foreground"
                )}>
                  ${budget.spent} / ${budget.limit}
                  {isOverBudget && <span className="ml-1 text-xs">(over!)</span>}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isOverBudget ? "bg-destructive" : budget.color
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-6 py-2.5 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">
        Edit Budgets
      </button>
    </div>
  );
}
