import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Music, Tv, Cloud, Dumbbell } from "lucide-react";

const recurringItems = [
  {
    id: 1,
    name: "Netflix",
    amount: 15.99,
    dueDate: "15th",
    icon: Tv,
    category: "Entertainment",
  },
  {
    id: 2,
    name: "Spotify",
    amount: 9.99,
    dueDate: "20th",
    icon: Music,
    category: "Entertainment",
  },
  {
    id: 3,
    name: "iCloud",
    amount: 2.99,
    dueDate: "1st",
    icon: Cloud,
    category: "Storage",
  },
  {
    id: 4,
    name: "Gym Membership",
    amount: 49.99,
    dueDate: "5th",
    icon: Dumbbell,
    category: "Health",
  },
];

export const RecurringView = () => {
  const totalMonthly = recurringItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-2xl font-bold mb-1">Recurring</h1>
        <p className="text-muted-foreground text-sm">Monthly subscriptions</p>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Monthly</p>
            <p className="text-2xl font-bold">${totalMonthly.toFixed(2)}</p>
          </div>
          <Calendar className="w-8 h-8 text-primary" />
        </div>
      </Card>

      <div className="space-y-3">
        {recurringItems.map((item) => (
          <Card
            key={item.id}
            className="p-4 bg-card border-border flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <item.icon className="w-5 h-5 text-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                Due {item.dueDate} every month
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${item.amount}</p>
              <Badge variant="secondary" className="text-xs">
                {item.category}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <button className="w-full py-3 border-2 border-dashed border-muted-foreground/30 rounded-xl text-muted-foreground text-sm hover:border-primary hover:text-primary transition-colors">
        + Add recurring expense
      </button>
    </div>
  );
};
