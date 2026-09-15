import { AreaChart, Area, XAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { OnboardingAnswers } from "@/hooks/useOnboarding";

interface SavingsProjectionInsightProps {
  answers: OnboardingAnswers;
}

const chartConfig: ChartConfig = {
  savings: { label: "Projected savings", color: "hsl(var(--primary))" },
};

export const SavingsProjectionInsight = ({ answers }: SavingsProjectionInsightProps) => {
  const monthlyGoal =
    answers.monthlySavingsGoal && answers.monthlySavingsGoal > 0 ? answers.monthlySavingsGoal : 100;

  const data = Array.from({ length: 6 }).map((_, i) => ({
    month: `Mo ${i + 1}`,
    savings: monthlyGoal * (i + 1),
  }));

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="font-display text-3xl font-bold text-primary">
        ${data[data.length - 1].savings.toLocaleString()}
      </p>
      <p className="text-xs text-muted-foreground -mt-2">saved in 6 months at ${monthlyGoal}/mo</p>
      <ChartContainer config={chartConfig} className="w-full aspect-[4/3] max-h-[200px]">
        <AreaChart data={data} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <Area type="monotone" dataKey="savings" stroke="hsl(var(--primary))" fill="url(#savingsFill)" strokeWidth={2} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};
