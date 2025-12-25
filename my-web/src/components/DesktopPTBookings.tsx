import { useState } from "react";
import { ArrowLeft, Calendar, Clock, User, MapPin, Phone, Mail, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Booking {
  id: number;
  client: {
    name: string;
    email: string;
    phone: string;
    image: string;
  };
  sessionType: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  notes?: string;
}

interface DesktopPTBookingsProps {
  onBack: () => void;
  onMessageClient: (clientName: string) => void;
}

const mockBookings: Booking[] = [
  {
    id: 1,
    client: {
      name: "John Davis",
      email: "john.davis@email.com",
      phone: "(555) 123-4567",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400"
    },
    sessionType: "Strength Training",
    date: "2024-12-05",
    time: "6:00 AM",
    duration: 60,
    price: 80,
    status: "confirmed",
    notes: "Focus on upper body"
  },
  {
    id: 2,
    client: {
      name: "Sarah Martinez",
      email: "sarah.m@email.com",
      phone: "(555) 234-5678",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
    },
    sessionType: "HIIT",
    date: "2024-12-05",
    time: "7:00 AM",
    duration: 45,
    price: 70,
    status: "confirmed"
  },
  {
    id: 3,
    client: {
      name: "Mike Roberts",
      email: "mike.r@email.com",
      phone: "(555) 345-6789",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    },
    sessionType: "Powerlifting",
    date: "2024-12-05",
    time: "5:00 PM",
    duration: 90,
    price: 120,
    status: "pending",
    notes: "First session - assess current strength levels"
  },
  {
    id: 4,
    client: {
      name: "Emma Wilson",
      email: "emma.w@email.com",
      phone: "(555) 456-7890",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
    },
    sessionType: "Strength Training",
    date: "2024-12-06",
    time: "6:00 PM",
    duration: 60,
    price: 80,
    status: "confirmed"
  },
  {
    id: 5,
    client: {
      name: "Alex Chen",
      email: "alex.chen@email.com",
      phone: "(555) 567-8901",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
    },
    sessionType: "CrossFit",
    date: "2024-12-03",
    time: "7:00 AM",
    duration: 60,
    price: 80,
    status: "completed"
  }
];

export function DesktopPTBookings({ onBack, onMessageClient }: DesktopPTBookingsProps) {
  const [selectedTab, setSelectedTab] = useState("upcoming");

  const upcomingBookings = mockBookings.filter(b => 
    b.status === "confirmed" || b.status === "pending"
  );
  const completedBookings = mockBookings.filter(b => b.status === "completed");
  const pendingBookings = mockBookings.filter(b => b.status === "pending");

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-primary/20 text-primary";
      case "pending":
        return "bg-yellow-500/20 text-yellow-600";
      case "completed":
        return "bg-green-500/20 text-green-600";
      case "cancelled":
        return "bg-red-500/20 text-red-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="p-6 border-border bg-card hover:shadow-lg transition-shadow">
      <div className="flex gap-6">
        {/* Client Avatar */}
        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={booking.client.image}
            alt={booking.client.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Booking Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-foreground mb-1">{booking.client.name}</h3>
              <p className="text-muted-foreground text-sm">{booking.sessionType}</p>
            </div>
            <Badge className={`${getStatusColor(booking.status)} border-0`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{booking.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{booking.time} ({booking.duration} min)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{booking.client.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{booking.client.phone}</span>
            </div>
          </div>

          {booking.notes && (
            <div className="mb-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground text-sm">
                <strong>Notes:</strong> {booking.notes}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-primary text-lg">${booking.price}</span>
            
            <div className="flex gap-2">
              <Button
                onClick={() => onMessageClient(booking.client.name)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </Button>
              
              {booking.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    className="bg-primary text-white gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 text-red-500 hover:text-red-600"
                  >
                    <XCircle className="w-4 h-4" />
                    Decline
                  </Button>
                </>
              )}
              
              {booking.status === "confirmed" && (
                <Button
                  size="sm"
                  className="bg-primary text-white"
                >
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

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
            Back to Dashboard
          </Button>

          <h1 className="text-foreground mb-2">My Bookings</h1>
          <p className="text-muted-foreground">Manage your training sessions and client bookings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-border bg-card">
            <div className="text-muted-foreground text-sm mb-2">Upcoming Sessions</div>
            <div className="text-foreground text-3xl">{upcomingBookings.length}</div>
          </Card>
          <Card className="p-6 border-border bg-card">
            <div className="text-muted-foreground text-sm mb-2">Pending Approval</div>
            <div className="text-foreground text-3xl">{pendingBookings.length}</div>
          </Card>
          <Card className="p-6 border-border bg-card">
            <div className="text-muted-foreground text-sm mb-2">Completed This Week</div>
            <div className="text-foreground text-3xl">{completedBookings.length}</div>
          </Card>
        </div>

        {/* Bookings Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
