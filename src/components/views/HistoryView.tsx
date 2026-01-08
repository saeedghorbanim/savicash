import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

const historyItems = [
  {
    id: 1,
    title: "Gas",
    category: "Transportation",
    location: "Gas Station",
    amount: 12.00,
    date: "1/7/2026",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Groceries",
    category: "Food & Dining",
    location: "Walmart",
    amount: 45.50,
    date: "1/7/2026",
    color: "bg-orange-500",
  },
  {
    id: 3,
    title: "Coffee",
    category: "Food & Dining",
    location: "Starbucks",
    amount: 5.75,
    date: "1/6/2026",
    color: "bg-orange-500",
  },
  {
    id: 4,
    title: "Uber",
    category: "Transportation",
    location: "Uber",
    amount: 18.00,
    date: "1/6/2026",
    color: "bg-blue-500",
  },
  {
    id: 5,
    title: "Headphones",
    category: "Shopping",
    location: "Amazon",
    amount: 89.99,
    date: "1/5/2026",
    color: "bg-purple-500",
  },
  {
    id: 6,
    title: "Netflix",
    category: "Entertainment",
    location: "Netflix",
    amount: 15.99,
    date: "1/5/2026",
    color: "bg-red-500",
  },
];

export const HistoryView = () => {
  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <h1 className="text-xl font-bold">Transaction History</h1>

      <Card className="divide-y divide-border">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-4"
          >
            <div className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm sm:text-base">{item.title}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {item.category} • {item.location}
              </p>
              <p className="text-xs text-muted-foreground">{item.date}</p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <p className="font-semibold text-sm sm:text-base">
                ${item.amount.toFixed(2)}
              </p>
              <button className="text-red-500 hover:text-red-600 transition-colors p-1">
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};
