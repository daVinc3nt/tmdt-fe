import { Shield, FileText, HelpCircle, Mail } from "lucide-react";
import { MascotLogo } from "./MascotLogo";

interface DesktopFooterProps {
  onRefundPolicyClick: () => void;
}

export function DesktopFooter({ onRefundPolicyClick }: DesktopFooterProps) {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MascotLogo className="w-8 h-8" />
              <span className="text-foreground">FitConnect</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your ultimate fitness marketplace connecting trainers, gyms, and fitness enthusiasts.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <button className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Careers
                </button>
              </li>
              <li>
                <button className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <button className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Help Center
                </button>
              </li>
              <li>
                <button className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Safety
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onRefundPolicyClick}
                  className="text-muted-foreground text-sm hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Refund Policy
                </button>
              </li>
              <li>
                <button className="text-muted-foreground text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Terms of Service
                </button>
              </li>
              <li>
                <button className="text-muted-foreground text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            © 2024 FitConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <HelpCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
