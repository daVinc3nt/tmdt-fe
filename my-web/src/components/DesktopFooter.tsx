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
              Sàn giao dịch thể hình tối ưu kết nối huấn luyện viên, phòng tập và những người đam mê thể thao.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-foreground mb-4">Công ty</h4>
            <ul className="space-y-2">
              <li>
                <button className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Về chúng tôi
                </button>
              </li>
              <li>
                <button className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Tuyển dụng
                </button>
              </li>
              <li>
                <button className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Liên hệ
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-foreground mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <button className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Trung tâm trợ giúp
                </button>
              </li>
              <li>
                <button className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Câu hỏi thường gặp
                </button>
              </li>
              <li>
                <button className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  An toàn
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-foreground mb-4">Pháp lý</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onRefundPolicyClick}
                  className="text-muted-foreground text-sm hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Chính sách hoàn tiền
                </button>
              </li>
              <li>
                <button className="text-muted-foreground text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Điều khoản dịch vụ
                </button>
              </li>
              <li>
                <button className="text-muted-foreground text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Chính sách bảo mật
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            © 2024 FitConnect. Đã đăng ký bản quyền.
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
