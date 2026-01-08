import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle, Edit2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { BudgetLimit } from '@/hooks/useLocalStorage';

interface BudgetTrackerProps {
  budget: BudgetLimit | null;
  onSetBudget: (amount: number) => void;
}

export const BudgetTracker = ({ budget, onSetBudget }: BudgetTrackerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newLimit, setNewLimit] = useState(budget?.limit_amount?.toString() || '');
  const { toast } = useToast();

  const saveBudget = () => {
    const limitAmount = parseFloat(newLimit);
    if (isNaN(limitAmount) || limitAmount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid budget amount',
        variant: 'destructive',
      });
      return;
    }

    onSetBudget(limitAmount);
    setIsEditing(false);
    toast({
      title: 'Budget saved!',
      description: `Your monthly budget is now $${limitAmount.toFixed(2)}`,
    });
  };

  if (!budget && !isEditing) {
    return (
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">No budget set yet</p>
          <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
            Set Budget
          </Button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
        <p className="text-sm font-medium mb-3">Set Monthly Budget</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              placeholder="1000"
              className="pl-7"
            />
          </div>
          <Button size="icon" onClick={saveBudget}>
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const percentage = budget ? (budget.current_spent / budget.limit_amount) * 100 : 0;
  const isWarning = percentage >= 80 && percentage < 100;
  const isDanger = percentage >= 100;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isDanger ? (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          ) : isWarning ? (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          ) : (
            <CheckCircle className="h-4 w-4 text-primary" />
          )}
          <span className="text-sm font-medium">Monthly Budget</span>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8" 
          onClick={() => {
            setNewLimit(budget?.limit_amount?.toString() || '');
            setIsEditing(true);
          }}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-2">
        <Progress 
          value={Math.min(percentage, 100)} 
          className={cn(
            "h-3",
            isDanger && "[&>div]:bg-destructive",
            isWarning && "[&>div]:bg-yellow-500"
          )}
        />
        
        <div className="flex justify-between text-xs">
          <span className={cn(
            "font-medium",
            isDanger && "text-destructive",
            isWarning && "text-yellow-600"
          )}>
            ${budget?.current_spent.toFixed(2)} spent
          </span>
          <span className="text-muted-foreground">
            ${budget?.limit_amount.toFixed(2)} limit
          </span>
        </div>

        {isDanger && (
          <p className="text-xs text-destructive font-medium mt-2">
            ⚠️ You've exceeded your budget by ${((budget?.current_spent || 0) - (budget?.limit_amount || 0)).toFixed(2)}!
          </p>
        )}
        {isWarning && !isDanger && (
          <p className="text-xs text-yellow-600 font-medium mt-2">
            ⚡ Heads up! You've used {percentage.toFixed(0)}% of your budget.
          </p>
        )}
      </div>
    </div>
  );
};
