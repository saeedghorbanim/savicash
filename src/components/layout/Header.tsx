import { Bell, Search, Plus } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground">B</span>
            </div>
            <span className="font-display font-semibold text-lg">BudgetAI</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-foreground">Dashboard</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Transactions</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Budgets</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Goals</a>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="bg-transparent border-none outline-none text-sm w-40 placeholder:text-muted-foreground"
            />
          </div>
          
          <button className="p-2 rounded-lg hover:bg-muted transition-colors relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Add Expense</span>
          </button>
          
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-foreground">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
