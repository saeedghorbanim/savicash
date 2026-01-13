import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Sparkles, Shield, Zap, RefreshCw } from "lucide-react";
import { useInAppPurchase } from "@/hooks/useInAppPurchase";
import { FREE_USAGE_LIMIT } from "@/hooks/useAppUsage";
import appIcon from "@/assets/savicash-logo.png";

interface SubscriptionPaywallProps {
  onSubscriptionSuccess: () => void;
  usageCount: number;
}

export const SubscriptionPaywall = ({ 
  onSubscriptionSuccess,
  usageCount 
}: SubscriptionPaywallProps) => {
  const [showRestoreHint, setShowRestoreHint] = useState(false);
  
  const handlePurchaseSuccess = () => {
    onSubscriptionSuccess();
  };

  const { 
    isReady, 
    isLoading, 
    isPurchasing, 
    error, 
    purchase, 
    restore,
    getFormattedPrice 
  } = useInAppPurchase(handlePurchaseSuccess);

  const handleSubscribe = async () => {
    const success = await purchase();
    if (!success && !isReady) {
      // If we're in web mode, show a message
      console.log('Purchase not available in web mode');
    }
  };

  const handleRestore = async () => {
    const success = await restore();
    if (success) {
      setShowRestoreHint(false);
    }
  };

  const features = [
    { icon: Zap, text: "Unlimited expense tracking" },
    { icon: Sparkles, text: "AI-powered spending insights" },
    { icon: Shield, text: "Budget alerts & warnings" },
    { icon: Crown, text: "Full history & statistics" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 overflow-y-auto">
      <div className="flex flex-col items-center justify-start min-h-screen p-6 py-12">
        {/* App Icon Logo */}
        <div className="mb-2">
          <img 
            src={appIcon} 
            alt="SaviCash" 
            className="w-24 h-24 rounded-3xl shadow-xl"
          />
        </div>
        
        {/* App Name */}
        <h2 className="text-2xl font-bold text-foreground mb-6">SaviCash</h2>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Unlock Pro
          </h1>
          <p className="text-muted-foreground text-sm">
            You've used your {FREE_USAGE_LIMIT} free entries.
            <br />
            Subscribe to continue tracking!
          </p>
        </div>

      {/* Main Card */}
      <Card className="w-full max-w-sm border-primary/20 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Pro Monthly</CardTitle>
          <div className="flex items-baseline justify-center gap-1 mt-2">
            <span className="text-4xl font-bold text-primary">{getFormattedPrice()}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Features */}
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground">{feature.text}</span>
              </li>
            ))}
          </ul>

          {/* Error message */}
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Subscribe Button */}
          <Button
            className="w-full h-14 text-lg font-semibold"
            size="lg"
            onClick={handleSubscribe}
            disabled={isLoading || isPurchasing}
          >
            {isPurchasing ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : isLoading ? (
              "Loading..."
            ) : (
              <>
                <Crown className="w-5 h-5 mr-2" />
                Subscribe Now
              </>
            )}
          </Button>

          {/* Restore purchases */}
          <div className="text-center">
            <button
              className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              onClick={handleRestore}
              disabled={isLoading}
            >
              Already subscribed? Restore purchase
            </button>
          </div>

          {/* Fine print */}
          <p className="text-xs text-center text-muted-foreground">
            Subscription automatically renews monthly.
            <br />
            Cancel anytime in App Store settings.
          </p>
        </CardContent>
      </Card>

        {/* Usage info */}
        <p className="mt-6 text-sm text-muted-foreground">
          Expenses logged: {usageCount}/{FREE_USAGE_LIMIT} free
        </p>
        
        {/* Scroll indicator */}
        <div className="mt-8 pb-8">
          <p className="text-xs text-muted-foreground/50">Scroll for more</p>
        </div>
      </div>
    </div>
  );
};
