import { Bell, X, Check, Clock, Package, User } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface Notification {
  id: number;
  type: "booking" | "order" | "message" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface DesktopNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationClick?: (id: number) => void;
}

export function DesktopNotifications({ isOpen, onClose, onNotificationClick }: DesktopNotificationsProps) {
  const notifications: Notification[] = [
    {
      id: 1,
      type: "booking",
      title: "Session Confirmed",
      message: "Your session with Sarah Johnson is confirmed for Nov 8, 2024 at 10:00 AM",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "order",
      title: "Order Shipped",
      message: "Your order #ORD-2024-1234 has been shipped and is on its way",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "message",
      title: "New Message",
      message: "Marcus Steel sent you a message about your training plan",
      time: "1 day ago",
      read: false,
    },
    {
      id: 4,
      type: "system",
      title: "Profile Updated",
      message: "Your fitness profile has been successfully updated",
      time: "2 days ago",
      read: true,
    },
    {
      id: 5,
      type: "booking",
      title: "Session Reminder",
      message: "Your session with Mike Chen is tomorrow at 3:00 PM",
      time: "3 days ago",
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "order":
        return <Package className="w-5 h-5 text-green-500" />;
      case "message":
        return <User className="w-5 h-5 text-primary" />;
      case "system":
        return <Bell className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Notifications Panel */}
      <Card className="fixed top-20 right-6 w-96 max-h-[600px] rounded-[20px] border-border shadow-xl z-50 overflow-hidden">
        <div className="p-4 border-b border-border bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[500px]">
          <div className="p-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-[12px] mb-2 cursor-pointer transition-colors ${
                  notification.read
                    ? "bg-transparent hover:bg-secondary"
                    : "bg-primary/5 hover:bg-primary/10"
                }`}
                onClick={() => onNotificationClick?.(notification.id)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-foreground text-sm">{notification.title}</h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-muted-foreground text-xs">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-border bg-white">
          <Button variant="ghost" className="w-full text-primary" size="sm">
            <Check className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        </div>
      </Card>
    </>
  );
}
