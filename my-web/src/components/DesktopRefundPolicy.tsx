import { ArrowLeft, Shield, Clock, DollarSign, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface DesktopRefundPolicyProps {
  onBack: () => void;
}

export function DesktopRefundPolicy({ onBack }: DesktopRefundPolicyProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-foreground mb-1">Refund Policy</h1>
              <p className="text-muted-foreground">Your satisfaction is our priority</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Overview */}
        <Card className="p-6 border-border bg-card mb-8">
          <h2 className="text-foreground mb-4">Policy Overview</h2>
          <p className="text-muted-foreground mb-4">
            At FitConnect, we strive to provide the best fitness experience for our customers. 
            We understand that circumstances change, and we've designed our refund policy to be fair and transparent 
            for both training services and gym products.
          </p>
          <p className="text-muted-foreground">
            Last Updated: December 5, 2024
          </p>
        </Card>

        {/* Training Services Refund */}
        <Card className="p-6 border-border bg-card mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[12px] bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-foreground">Training Services & Packages</h2>
          </div>

          <div className="space-y-6">
            {/* Single Sessions */}
            <div className="border-l-4 border-primary pl-4">
              <h3 className="text-foreground mb-2">Single Sessions</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">
                    <strong>Full Refund:</strong> Cancellations made 24+ hours before the scheduled session
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">
                    <strong>50% Refund:</strong> Cancellations made 12-24 hours before the session
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">
                    <strong>No Refund:</strong> Cancellations made less than 12 hours before or no-shows
                  </p>
                </div>
              </div>
            </div>

            {/* Package Plans */}
            <div className="border-l-4 border-primary pl-4">
              <h3 className="text-foreground mb-2">Weekly & Monthly Packages</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">
                    <strong>Full Refund:</strong> Within 7 days of purchase if no sessions have been used
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">
                    <strong>Prorated Refund:</strong> After 7 days, refund for unused sessions minus a 15% processing fee
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">
                    <strong>Minimum Commitment:</strong> Monthly packages require completion of at least 4 sessions for partial refund eligibility
                  </p>
                </div>
              </div>
            </div>

            {/* Special Circumstances */}
            <div className="p-4 bg-primary/5 rounded-[12px]">
              <h4 className="text-foreground text-sm mb-2">Special Circumstances</h4>
              <p className="text-muted-foreground text-sm">
                Medical emergencies or injuries preventing training may qualify for full refund with proper documentation. 
                Contact your trainer within 48 hours with medical certificate for consideration.
              </p>
            </div>
          </div>
        </Card>

        {/* Gym Products Refund */}
        <Card className="p-6 border-border bg-card mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[12px] bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-foreground">Gym Products & Equipment</h2>
          </div>

          <div className="space-y-6">
            {/* Product Returns */}
            <div className="border-l-4 border-primary pl-4">
              <h3 className="text-foreground mb-2">Supplements & Nutrition</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">
                    <strong>30-Day Return:</strong> Unopened products in original packaging
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">
                    <strong>Non-Refundable:</strong> Opened supplements due to health and safety regulations
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">
                    <strong>Defective Products:</strong> Full refund or replacement within 14 days with photo evidence
                  </p>
                </div>
              </div>
            </div>

            {/* Equipment Returns */}
            <div className="border-l-4 border-primary pl-4">
              <h3 className="text-foreground mb-2">Equipment & Accessories</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">
                    <strong>14-Day Return:</strong> Unused items with tags attached and original packaging
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">
                    <strong>Restocking Fee:</strong> 10% restocking fee applies to opened equipment
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">
                    <strong>Warranty Claims:</strong> Manufacturer warranty honored for defects (varies by product)
                  </p>
                </div>
              </div>
            </div>

            {/* Apparel */}
            <div className="border-l-4 border-primary pl-4">
              <h3 className="text-foreground mb-2">Gym Apparel</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">
                    <strong>30-Day Exchange:</strong> Unworn items with original tags for different size or color
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">
                    <strong>Non-Refundable:</strong> Worn or washed items (hygiene reasons)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Refund Process */}
        <Card className="p-6 border-border bg-card mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[12px] bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-foreground">How to Request a Refund</h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="text-foreground mb-1">Contact the Seller</h4>
                <p className="text-muted-foreground text-sm">
                  For training services, message your trainer directly through the app. 
                  For products, contact the gym store through your order page.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="text-foreground mb-1">Provide Details</h4>
                <p className="text-muted-foreground text-sm">
                  Include your order/booking number, reason for refund, and any supporting documentation (e.g., photos for defective products).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="text-foreground mb-1">Review & Approval</h4>
                <p className="text-muted-foreground text-sm">
                  The seller will review your request within 24-48 hours and approve or provide alternatives.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="text-foreground mb-1">Receive Refund</h4>
                <p className="text-muted-foreground text-sm">
                  Approved refunds are processed within 5-10 business days to your original payment method.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Important Notes */}
        <Card className="p-6 border-border bg-card border-primary/20">
          <h3 className="text-foreground mb-4">Important Notes</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
              <p className="text-muted-foreground text-sm">
                Refunds are issued to the original payment method only
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
              <p className="text-muted-foreground text-sm">
                Return shipping costs for products are the customer's responsibility unless the product is defective
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
              <p className="text-muted-foreground text-sm">
                Promotional discounts and coupons are non-refundable if the package is partially used
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
              <p className="text-muted-foreground text-sm">
                FitConnect reserves the right to refuse refunds for suspected fraud or abuse of the policy
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
              <p className="text-muted-foreground text-sm">
                For disputes, please contact FitConnect Support at support@fitconnect.com
              </p>
            </li>
          </ul>
        </Card>

        {/* Contact Support */}
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Have questions about our refund policy?
          </p>
          <Button className="bg-primary text-white">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
