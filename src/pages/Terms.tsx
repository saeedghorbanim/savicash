import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Terms = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-background overflow-y-auto">
      <div className="p-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="outline" 
            size="default" 
            className="mb-6 active:scale-[0.97] active:bg-primary/10 transition-all duration-150 touch-manipulation"
            onClick={handleBack}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <h1 className="text-2xl font-bold mb-6">Terms of Use</h1>
          
          <div className="prose prose-sm text-muted-foreground space-y-4">
            <p><strong>Last Updated:</strong> January 2025</p>

            <h2 className="text-lg font-semibold text-foreground mt-6">1. Acceptance of Terms</h2>
            <p>
              By downloading, installing, or using SaviCash ("the App"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the App.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-6">2. Description of Service</h2>
            <p>
              SaviCash is a personal expense tracking application that helps users manage their finances through voice input, AI-powered categorization, and budget tracking features.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-6">3. Subscription Terms</h2>
            <p>
              SaviCash offers an auto-renewable monthly subscription ("SaviCash Pro") that provides unlimited expense tracking and additional features.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Subscription Name:</strong> SaviCash Pro Monthly</li>
              <li><strong>Price:</strong> $2.99 USD per month</li>
              <li><strong>Billing:</strong> Payment will be charged to your Apple ID account at confirmation of purchase</li>
              <li><strong>Renewal:</strong> Subscription automatically renews unless canceled at least 24 hours before the end of the current period</li>
              <li><strong>Management:</strong> You can manage and cancel your subscription in your App Store account settings</li>
            </ul>

            <h2 className="text-lg font-semibold text-foreground mt-6">4. Free Trial</h2>
            <p>
              Users may track up to 2 expenses for free. After reaching this limit, a subscription is required for continued use.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-6">5. Cancellation and Refunds</h2>
            <p>
              You may cancel your subscription at any time. To cancel:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Open the Settings app on your iPhone</li>
              <li>Tap your name at the top</li>
              <li>Tap "Subscriptions"</li>
              <li>Select "SaviCash Pro"</li>
              <li>Tap "Cancel Subscription"</li>
            </ul>
            <p className="mt-2">
              Your subscription will remain active until the end of the current billing period. No refunds are provided for partial subscription periods.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-6">6. User Responsibilities</h2>
            <p>
              You are responsible for maintaining the accuracy of any financial data you enter into the App. The App is for personal budgeting purposes only and should not be used as professional financial advice.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-6">7. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the App are owned by SaviCash and are protected by copyright and other intellectual property laws.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-6">8. Limitation of Liability</h2>
            <p>
              SaviCash is provided "as is" without warranties of any kind. We are not liable for any financial decisions made based on information in the App.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-6">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the App after changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-6">10. Contact</h2>
            <p>
              For questions about these Terms of Use, please email us at{" "}
              <a href="mailto:savicashapp@gmail.com" className="text-primary underline">
                savicashapp@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
