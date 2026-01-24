import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-background overflow-y-auto">
      {/* Sticky header with back button */}
      <div 
        className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <Button 
          variant="ghost" 
          size="lg" 
          className="active:scale-[0.97] active:bg-muted transition-all duration-150 touch-manipulation -ml-2"
          onClick={handleBack}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </div>
      
      <div className="p-6 pb-12">
        <div className="max-w-2xl mx-auto">

          <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose prose-sm text-muted-foreground space-y-4">
            <p><strong>Last Updated:</strong> January 2025</p>

            <h2 className="text-lg font-semibold text-foreground mt-6">1. Introduction</h2>
            <p>
              SaviCash ("we", "our", or "the App") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-6">2. Information We Collect</h2>
            <p>The App may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Expense Data:</strong> Amounts, descriptions, categories, and dates of expenses you enter</li>
              <li><strong>Budget Information:</strong> Budget limits and categories you set</li>
              <li><strong>Voice Recordings:</strong> Temporary audio when using voice input (processed and immediately deleted)</li>
              <li><strong>Receipt Images:</strong> Photos of receipts for expense analysis (processed and not permanently stored)</li>
            </ul>

            <h2 className="text-lg font-semibold text-foreground mt-6">3. How We Use Your Information</h2>
            <p>Your information is used to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide expense tracking and budgeting features</li>
              <li>Generate spending insights and statistics</li>
              <li>Improve the App's functionality and user experience</li>
            </ul>

            <h2 className="text-lg font-semibold text-foreground mt-6">4. Data Storage</h2>
            <p>
              Your expense and budget data is stored locally on your device and may be synced to secure cloud servers to enable features across devices. We use industry-standard security measures to protect your data.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-6">5. Third-Party Services</h2>
            <p>
              The App may use third-party services for AI-powered features (such as expense categorization and voice transcription). These services process data securely and do not retain personal information.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-6">6. Data Sharing</h2>
            <p>
              We do not sell, trade, or share your personal financial data with third parties for marketing purposes.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-6">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your data stored in the App</li>
              <li>Delete your data by uninstalling the App</li>
              <li>Cancel your subscription at any time through App Store settings</li>
            </ul>

            <h2 className="text-lg font-semibold text-foreground mt-6">8. Children's Privacy</h2>
            <p>
              The App is not intended for children under 13. We do not knowingly collect information from children under 13.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-6">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy in the App.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-6">10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us through the App Store.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
