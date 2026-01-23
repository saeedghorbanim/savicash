import { useState, useRef } from "react";
import { DollarSign } from "lucide-react";
import { loadDemoData, clearDemoData } from "@/utils/demoData";
import { toast } from "sonner";
import { ProfileMenu } from "@/components/profile/ProfileMenu";

interface AppHeaderProps {
  monthlyTotal: number;
  onDemoDataLoaded?: () => void;
}

export const AppHeader = ({ monthlyTotal, onDemoDataLoaded }: AppHeaderProps) => {
  const [tapCount, setTapCount] = useState(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const sub = localStorage.getItem('savicash_subscription');
    return sub?.includes('demo_mode') || false;
  });

  const handleLogoTap = () => {
    // Clear previous timeout
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount >= 5) {
      // Toggle demo mode
      if (isDemoMode) {
        clearDemoData();
        setIsDemoMode(false);
        toast.success("Demo data cleared! Refresh the app.", {
          description: "Pull down to refresh or reopen the app",
        });
      } else {
        loadDemoData();
        setIsDemoMode(true);
        toast.success("Demo data loaded! Refresh the app.", {
          description: "10 expenses + 90% budget usage added",
        });
      }
      setTapCount(0);
      onDemoDataLoaded?.();
    } else if (newCount >= 3) {
      // Show hint after 3 taps
      toast.info(`${5 - newCount} more taps for ${isDemoMode ? 'clear' : 'demo'} mode`, {
        duration: 1500,
      });
    }

    // Reset counter after 2 seconds of no taps
    tapTimeoutRef.current = setTimeout(() => {
      setTapCount(0);
    }, 2000);
  };

  return (
    <header 
      className="bg-gradient-to-r from-primary to-accent px-4 pb-4 text-primary-foreground"
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogoTap}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform active:scale-95"
            aria-label="App logo"
          >
            <DollarSign className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-bold text-lg">
              SaviCash
              {isDemoMode && <span className="text-xs ml-1 opacity-70">(Demo)</span>}
            </h1>
            <p className="text-xs opacity-90">Save Smart, Live Better</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs opacity-80">This Month</p>
            <p className="text-xl font-bold font-display">
              ${monthlyTotal.toFixed(2)}
            </p>
          </div>
          
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};
