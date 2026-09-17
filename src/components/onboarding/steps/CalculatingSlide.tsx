import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalculatingSlideProps {
  onDone: () => void;
}

const PLAN_ITEMS = [
  "Spending pattern analysis",
  "Personalized budget breakdown",
  "Savings growth roadmap",
  "Smart alert setup",
  "Financial forecast",
];

const STATUS_MESSAGES = [
  "Analyzing your spending habits...",
  "Building your budget breakdown...",
  "Calculating your savings potential...",
  "Finalizing your plan...",
];

const TOTAL_DURATION_MS = 3200;
const STEP_MS = 60;

export const CalculatingSlide = ({ onDone }: CalculatingSlideProps) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const increment = 100 / (TOTAL_DURATION_MS / STEP_MS);
    const interval = setInterval(() => {
      setPercent((p) => Math.min(100, p + increment));
    }, STEP_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (percent >= 100) {
      const timeout = setTimeout(onDone, 700);
      return () => clearTimeout(timeout);
    }
  }, [percent, onDone]);

  const roundedPercent = Math.round(percent);
  const statusIndex = Math.min(STATUS_MESSAGES.length - 1, Math.floor((percent / 100) * STATUS_MESSAGES.length));
  const checkedCount = Math.floor((percent / 100) * PLAN_ITEMS.length);

  return (
    <div className="min-h-full flex flex-col items-center justify-center py-10 text-center">
      <p className="font-display text-6xl font-bold text-foreground mb-6">{roundedPercent}%</p>

      <h1 className="font-display text-2xl font-bold text-foreground mb-6 px-4">
        Building your personalized plan
      </h1>

      <div className="w-full max-w-sm px-2 mb-3">
        <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-[width] duration-150 ease-linear"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-8">{STATUS_MESSAGES[statusIndex]}</p>

      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-5 text-left">
        <p className="font-semibold text-foreground mb-4">Your plan includes:</p>
        <div className="space-y-3">
          {PLAN_ITEMS.map((item, i) => {
            const isChecked = i < checkedCount;
            return (
              <div key={item} className="flex items-center justify-between gap-3">
                <span className={cn("text-sm", isChecked ? "text-foreground" : "text-muted-foreground")}>
                  {item}
                </span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                  {isChecked && (
                    <motion.div
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
