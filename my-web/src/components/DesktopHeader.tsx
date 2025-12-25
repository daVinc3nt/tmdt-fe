import { ShoppingCart, User, Bell, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MascotLogo } from "./MascotLogo";
import { DesktopNotifications } from "./DesktopNotifications";
import { useState } from "react";

interface DesktopHeaderProps {
  userType?: string;
  onSwitchUser?: () => void;
  onNavigateHome?: () => void;
  onNavigateTrainers?: () => void;
  onNavigateMarketplace?: () => void;
  onNavigateCart?: () => void;
  onNavigateOrders?: () => void;
  onNavigateAbout?: () => void;
  onNavigateProfile?: () => void;
  onBookSession?: () => void;
  onNavigateMyPT?: () => void;
  cartCount?: number;
}

export function DesktopHeader({
  userType = "Customer",
  onSwitchUser,
  onNavigateHome,
  onNavigateTrainers,
  onNavigateMyPT,
  onNavigateMarketplace,
  onNavigateCart,
  onNavigateOrders,
  onNavigateAbout,
  onNavigateProfile,
  onBookSession,
  cartCount = 0
}: DesktopHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={onNavigateHome}
            >
              <MascotLogo className="w-12 h-12" />

              <div className="leading-tight">
                <h1 className="text-lg font-extrabold tracking-tight">
                  FitConnect
                </h1>
                <p className="text-xs text-muted-foreground">
                  Find Your Strength
                </p>
              </div>
            </div>

            {/* Navigation */}
            {userType !== "Admin" && (
              <nav className="hidden md:flex items-center gap-6">
                <Button variant="ghost" className="text-foreground" onClick={onNavigateTrainers || onNavigateHome}>
                  Find Trainers
                </Button>
                <Button variant="ghost" className="text-foreground" onClick={onNavigateMyPT}>
                  My PT
                </Button>
                <Button variant="ghost" className="text-foreground" onClick={onNavigateMarketplace}>
                  Marketplace
                </Button>
                <Button variant="ghost" className="text-foreground" onClick={onNavigateAbout}>
                  About
                </Button>
              </nav>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              {userType !== "Admin" && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell className="w-5 h-5 text-foreground" />
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white border-0 p-0 flex items-center justify-center text-xs">
                      3
                    </Badge>
                  </Button>
                  <Button variant="ghost" size="icon" className="relative" onClick={onNavigateCart}>
                    <ShoppingCart className="w-5 h-5 text-foreground" />
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white border-0 p-0 flex items-center justify-center text-xs">
                      {cartCount}
                    </Badge>
                  </Button>
                </>
              )}
              <Button variant="ghost" size="icon" onClick={onNavigateProfile} title="Thông tin tài khoản">
                <User className="w-5 h-5 text-foreground" />
              </Button>
              {userType === "Admin" ? (
                <Button variant="outline" className="gap-2" onClick={onSwitchUser}>
                  <LogOut className="w-4 h-4" />
                  Log out
                </Button>
              ) : (
                <Button className="bg-primary text-white" onClick={onBookSession}>
                  {userType === "Customer" ? "Book Session" : "Dashboard"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      <DesktopNotifications
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onNotificationClick={(id) => {
          console.log("Notification clicked:", id);
          setShowNotifications(false);
        }}
      />
    </>
  );
}