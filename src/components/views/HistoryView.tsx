import { Card } from "@/components/ui/card";
import { Coffee, ShoppingBag, Car, Utensils, Gamepad2 } from "lucide-react";

const historyItems = [
  {
    id: 1,
    description: "Morning coffee",
    amount: 5.50,
    category: "Food",
    date: "Today",
    time: "8:30 AM",
    icon: Coffee,
  },
  {
    id: 2,
    description: "Uber to work",
    amount: 12.00,
    category: "Transport",
    date: "Today",
    time: "7:45 AM",
  },
  {
    id: 3,
    description: "Lunch with team",
    amount: 24.50,
    category: "Food",
    date: "Yesterday",
    time: "12:30 PM",
    icon: Utensils,
  },
  {
    id: 4,
    description: "New headphones",
    amount: 89.99,
    category: "Shopping",
    date: "Yesterday",
    time: "3:15 PM",
    icon: ShoppingBag,
  },
  {
    id: 5,
    description: "Gas station",
    amount: 45.00,
    category: "Transport",
    date: "Jan 5",
    time: "6:00 PM",
    icon: Car,
  },
  {
    id: 6,
    description: "Video game",
    amount: 59.99,
    category: "Entertainment",
    date: "Jan 4",
    time: "9:00 PM",
    icon: Gamepad2,
  },
];

const getIcon = (category: string) => {
  const icons: Record<string, typeof Coffee> = {
    Food: Coffee,
    Transport: Car,
    Shopping: ShoppingBag,
    Entertainment: Gamepad2,
  };
  return icons[category] || Coffee;
};

export const HistoryView = () => {
  const groupedByDate = historyItems.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, typeof historyItems>);

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-2xl font-bold mb-1">History</h1>
        <p className="text-muted-foreground text-sm">All your expenses</p>
      </div>

      {Object.entries(groupedByDate).map(([date, items]) => (
        <div key={date}>
          <p className="text-sm font-medium text-muted-foreground mb-3">{date}</p>
          <div className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon || getIcon(item.category);
              return (
                <Card
                  key={item.id}
                  className="p-3 bg-card border-border flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.category} • {item.time}
                    </p>
                  </div>
                  <p className="font-semibold text-sm">
                    -${item.amount.toFixed(2)}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
