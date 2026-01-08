import { useState, useEffect } from 'react';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string | null;
  store: string | null;
  created_at: string;
}

export interface BudgetLimit {
  id: string;
  category: string;
  limit_amount: number;
  current_spent: number;
  period: string;
}

const EXPENSES_KEY = 'savicash_expenses';
const BUDGET_KEY = 'savicash_budget';

export const useLocalStorage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<BudgetLimit | null>(null);

  // Load data on mount with error handling for corrupted data
  useEffect(() => {
    // Load expenses with error handling
    try {
      const storedExpenses = localStorage.getItem(EXPENSES_KEY);
      if (storedExpenses) {
        const parsed = JSON.parse(storedExpenses);
        // Validate it's an array
        if (Array.isArray(parsed)) {
          setExpenses(parsed);
        } else {
          console.error('Invalid expenses data format, resetting');
          localStorage.removeItem(EXPENSES_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load expenses from localStorage:', error);
      localStorage.removeItem(EXPENSES_KEY);
    }

    // Load budget with error handling
    try {
      const storedBudget = localStorage.getItem(BUDGET_KEY);
      if (storedBudget) {
        const parsed = JSON.parse(storedBudget);
        // Validate it has required fields
        if (parsed && typeof parsed === 'object' && 'limit_amount' in parsed) {
          setBudget(parsed);
        } else {
          console.error('Invalid budget data format, resetting');
          localStorage.removeItem(BUDGET_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load budget from localStorage:', error);
      localStorage.removeItem(BUDGET_KEY);
    }
  }, []);

  // Save expenses
  const saveExpenses = (newExpenses: Expense[]) => {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(newExpenses));
    setExpenses(newExpenses);
  };

  // Add expense
  const addExpense = (expense: Omit<Expense, 'id' | 'created_at'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    
    const updatedExpenses = [...expenses, newExpense];
    saveExpenses(updatedExpenses);

    // Auto-update budget spending
    if (budget) {
      const updatedBudget = {
        ...budget,
        current_spent: budget.current_spent + expense.amount,
      };
      saveBudget(updatedBudget);
    }

    return newExpense;
  };

  // Delete expense
  const deleteExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    const updatedExpenses = expenses.filter(e => e.id !== id);
    saveExpenses(updatedExpenses);

    // Update budget if expense was deleted
    if (expense && budget) {
      const updatedBudget = {
        ...budget,
        current_spent: Math.max(0, budget.current_spent - expense.amount),
      };
      saveBudget(updatedBudget);
    }
  };

  // Save budget
  const saveBudget = (newBudget: BudgetLimit) => {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(newBudget));
    setBudget(newBudget);
  };

  // Set budget limit
  const setBudgetLimit = (limitAmount: number) => {
    const newBudget: BudgetLimit = {
      id: budget?.id || Date.now().toString(),
      category: 'total',
      limit_amount: limitAmount,
      current_spent: budget?.current_spent || 0,
      period: 'monthly',
    };
    saveBudget(newBudget);
  };

  // Reset monthly spending (call at start of new month)
  const resetMonthlySpending = () => {
    if (budget) {
      saveBudget({ ...budget, current_spent: 0 });
    }
  };

  // Clear all data
  const clearAllData = () => {
    localStorage.removeItem(EXPENSES_KEY);
    localStorage.removeItem(BUDGET_KEY);
    setExpenses([]);
    setBudget(null);
  };

  return {
    expenses,
    budget,
    addExpense,
    deleteExpense,
    setBudgetLimit,
    saveBudget,
    resetMonthlySpending,
    clearAllData,
  };
};
