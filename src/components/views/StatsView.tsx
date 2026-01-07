import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const stats = [
  { label: "This Month", value: "$1,240", icon: DollarSign, trend: null },
  { label: "vs Last Month", value: "-12%", icon: TrendingDown, trend: "positive" },
  { label: "Daily Average", value: "$41", icon: TrendingUp, trend: "neutral" },
];

const categories = [
  { name: "Food & Dining", amount: 450, percentage: 36, color: "bg-primary" },
  { name: "Transport", amount: 280, percentage: 23, color: "bg-emerald-500" },
  { name: "Shopping", amount: 220, percentage: 18, color: "bg-blue-500" },
  { name: "Entertainment", amount: 180, percentage: 14, color: "bg-purple-500" },
  { name: "Other", amount: 110, percentage: 9, color: "bg-muted-foreground" },
];

export const StatsView = () => {
  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-2xl font-bold mb-1">Stats</h1>
        <p className="text-muted-foreground text-sm">January 2024</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-3 bg-card border-border">
            <stat.icon className="w-4 h-4 text-muted-foreground mb-2" />
            <p className="text-lg font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">By Category</h2>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.name}>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-sm text-muted-foreground">
                  ${category.amount}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${category.color} rounded-full transition-all`}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className="p-4 bg-primary/10 border-primary/20">
        <p className="text-sm text-primary font-medium">
          💡 You're spending 12% less than last month. Keep it up!
        </p>
      </Card>
    </div>
  );
};
