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
  const remaining = budget ? budget.limit_amount - budget.current_spent : 0;
  
  // Tiered alert levels
  const isWarning = percentage >= 80 && percentage < 90;
  const isUrgent = percentage >= 90 && percentage < 100;
  const isDanger = percentage >= 100;

  const getAlertMessage = () => {
    if (isDanger) {
      return {
        icon: "🚨",
        text: `You're over budget by $${((budget?.current_spent || 0) - (budget?.limit_amount || 0)).toFixed(2)}! Time to pause spending.`,
        className: "text-destructive bg-destructive/10"
      };
    }
    if (isUrgent) {
      return {
        icon: "⚠️",
        text: `Only ${(100 - percentage).toFixed(0)}% left! You're almost out of budget.`,
        className: "text-orange-600 bg-orange-500/10"
      };
    }
    if (isWarning) {
      return {
        icon: "💡",
        text: `${(100 - percentage).toFixed(0)}% remaining. Budget is running low.`,
        className: "text-yellow-600 bg-yellow-500/10"
      };
    }
    return null;
  };

  const alertMessage = getAlertMessage();

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isDanger ? (
            <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
          ) : isUrgent ? (
            <AlertTriangle className="h-4 w-4 text-orange-500" />
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

      {/* Remaining amount - prominent display */}
      <div className={cn(
        "text-2xl font-bold mb-2",
        isDanger && "text-destructive",
        isUrgent && "text-orange-600",
        isWarning && "text-yellow-600",
        !isDanger && !isUrgent && !isWarning && "text-primary"
      )}>
        ${remaining >= 0 ? remaining.toFixed(2) : '0.00'} 
        <span className="text-sm font-normal text-muted-foreground ml-1">remaining</span>
      </div>

      <div className="space-y-2">
        <Progress 
          value={Math.min(percentage, 100)} 
          className={cn(
            "h-2",
            isDanger && "[&>div]:bg-destructive",
            isUrgent && "[&>div]:bg-orange-500",
            isWarning && "[&>div]:bg-yellow-500"
          )}
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${budget?.current_spent.toFixed(2)} spent</span>
          <span>${budget?.limit_amount.toFixed(2)} limit</span>
        </div>

        {alertMessage && (
          <div className={cn("text-xs font-medium p-2 rounded-lg", alertMessage.className)}>
            {alertMessage.icon} {alertMessage.text}
          </div>
        )}
      </div>
    </div>
  );
};
