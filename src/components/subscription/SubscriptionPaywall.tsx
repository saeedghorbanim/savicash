import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Sparkles, Shield, Zap, RefreshCw } from "lucide-react";
import { useInAppPurchase } from "@/hooks/useInAppPurchase";
import { FREE_USAGE_LIMIT } from "@/hooks/useAppUsage";
import { toast } from "sonner";
import appIcon from "@/assets/savicash-logo.png";

interface SubscriptionPaywallProps {
  onSubscriptionSuccess: () => void;
  usageCount: number;
}

export const SubscriptionPaywall = ({ 
  onSubscriptionSuccess,
  usageCount 
}: SubscriptionPaywallProps) => {
  const navigate = useNavigate();
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
    // Show immediate visual feedback
    toast.loading("Connecting to App Store...", { id: "purchase" });
    
    const success = await purchase();
    
    if (!success) {
      if (!isReady) {
        toast.error("Unable to connect to App Store. Please try again.", { id: "purchase" });
      } else if (error) {
        toast.error(error, { id: "purchase" });
      } else {
        toast.dismiss("purchase");
      }
    }
  };

  const handleRestore = async () => {
    toast.loading("Restoring purchases...", { id: "restore" });
    
    const success = await restore();
    
    if (success) {
      toast.success("Purchases restored successfully!", { id: "restore" });
      setShowRestoreHint(false);
    } else {
      toast.error("No previous purchases found.", { id: "restore" });
    }
  };

  const handleTermsPress = () => {
    navigate("/terms");
  };

  const handlePrivacyPress = () => {
    navigate("/privacy");
  };

  const features = [
    { icon: Zap, text: "Unlimited expense tracking" },
    { icon: Sparkles, text: "AI-powered spending insights" },
    { icon: Shield, text: "Budget alerts & warnings" },
    { icon: Crown, text: "Full history & statistics" },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-background to-muted/30 overflow-y-auto overscroll-contain">
      <div className="flex flex-col items-center justify-start p-6 py-12 pb-safe">
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
            You've used your {FREE_USAGE_LIMIT + 1} free entries.
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
          {/* Exact subscription product name */}
          <CardTitle className="text-2xl">SaviCash Pro Monthly</CardTitle>
          
          {/* Price display */}
          <div className="flex items-baseline justify-center gap-1 mt-2">
            <span className="text-4xl font-bold text-primary">{getFormattedPrice()}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          
          {/* Explicit subscription length */}
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            1 Month • Auto-Renewable
          </p>
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

          {/* Prominent Subscription Terms Box */}
          <div className="bg-muted/50 border border-border rounded-lg p-4 text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Subscription Terms:</p>
            <ul className="space-y-1.5">
              <li>• <strong>Price:</strong> $2.99 USD per month</li>
              <li>• <strong>Duration:</strong> 1 month, auto-renewable</li>
              <li>• Payment charged to Apple ID at confirmation</li>
              <li>• Renews automatically unless canceled 24 hours before period ends</li>
              <li>• Manage or cancel anytime in App Store settings</li>
            </ul>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Subscribe Button */}
          <Button
            className="w-full h-14 text-lg font-semibold shadow-lg transition-all duration-150 active:scale-[0.97] active:shadow-sm active:brightness-[0.85] hover:brightness-110"
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

          {/* Restore purchases - DISTINCT BUTTON per App Store Guidelines 3.1.1 */}
          <Button
            variant="outline"
            className="w-full h-12 text-base font-medium"
            onClick={handleRestore}
            disabled={isLoading || isPurchasing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Restore Purchases
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Already subscribed? Tap above to restore your purchase.
          </p>

          {/* Legal links - Large tappable buttons */}
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={handleTermsPress}
              className="px-4 py-3 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80 active:scale-[0.97] transition-all duration-150 touch-manipulation min-h-[44px] min-w-[44px]"
            >
              Terms of Use
            </button>
            <button
              onClick={handlePrivacyPress}
              className="px-4 py-3 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80 active:scale-[0.97] transition-all duration-150 touch-manipulation min-h-[44px] min-w-[44px]"
            >
              Privacy Policy
            </button>
          </div>
        </CardContent>
      </Card>

        {/* Usage info */}
        <p className="mt-6 text-sm text-muted-foreground mb-8">
          Expenses logged: {usageCount}/{FREE_USAGE_LIMIT + 1} free
        </p>
      </div>
    </div>
  );
};
