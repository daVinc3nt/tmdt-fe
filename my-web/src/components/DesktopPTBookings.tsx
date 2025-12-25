import { ArrowLeft, Calendar, CheckCircle, Clock, Mail, MessageSquare, Phone, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import bookingService, { type BookingAPI, type BookingStatus } from "../services/bookingService";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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

const getAvatarUrl = (name: string) => {
  const safe = encodeURIComponent(name || 'User');
  return `https://ui-avatars.com/api/?name=${safe}&background=random`;
};

const formatDateParts = (iso?: string) => {
  if (!iso) return { date: 'N/A', time: 'N/A' };
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString('en-US');
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  } catch {
    return { date: iso, time: '' };
  }
};

const mapBookingStatus = (status?: BookingStatus): Booking['status'] => {
  switch (status) {
    case 'FINISHED':
      return 'completed';
    case 'CANCELLED':
      return 'cancelled';
    case 'PENDING':
    default:
      return 'pending';
  }
};

const getUserIdFromToken = (jwt: string | null): number | null => {
  if (!jwt) return null;
  try {
    const base64Url = jwt.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.userId || null;
  } catch {
    return null;
  }
};

export function DesktopPTBookings({ onBack, onMessageClient }: DesktopPTBookingsProps) {
  const { showError, showSuccess } = useToast();
  const { token } = useAuth();
  const trainerId = getUserIdFromToken(token);
  const [selectedTab, setSelectedTab] = useState("upcoming");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadBookings = async () => {
      setIsLoading(true);
      try {
        const data: BookingAPI[] = await bookingService.getAllBookings();
        const filtered = trainerId
          ? (data || []).filter((b) => {
            const pkg: any = b.bookingPackage;
            const trainer = pkg?.trainer_id || pkg?.trainer;
            const id = trainer?.id;
            return typeof id === 'number' ? id === trainerId : true;
          })
          : (data || []);

        const mapped: Booking[] = filtered.map((b) => {
          const traineeName = b.trainee?.fullName || 'Client';
          const traineeEmail = b.trainee?.email || '';
          const traineePhone = b.trainee?.phoneNumber || '';
          const { date, time } = formatDateParts(b.date);

          const duration = typeof b.bookingPackage?.duration === 'number' ? b.bookingPackage!.duration! : 60;

          return {
            id: b.id,
            client: {
              name: traineeName,
              email: traineeEmail,
              phone: traineePhone,
              image: getAvatarUrl(traineeName),
            },
            sessionType: b.bookingPackage?.name || 'Training session',
            date,
            time,
            duration,
            price: b.totalAmount || 0,
            status: mapBookingStatus(b.status),
          };
        });
        setBookings(mapped);
      } catch (e) {
        console.error('Failed to load bookings:', e);
        showError('Unable to load bookings.', 'Bookings');
      } finally {
        setIsLoading(false);
      }
    };
    loadBookings();
  }, [showError, trainerId]);

  const upcomingBookings = bookings.filter(b =>
    b.status === "confirmed" || b.status === "pending"
  );
  const completedBookings = bookings.filter(b => b.status === "completed");
  const pendingBookings = bookings.filter(b => b.status === "pending");

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
                    onClick={() => {
                      bookingService
                        .updateStatus(booking.id, 'FINISHED')
                        .then(() => {
                          setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status: 'completed' } : b)));
                          showSuccess('Booking updated.', 'Bookings');
                        })
                        .catch((e) => {
                          console.error('Failed to update booking:', e);
                          showError('Failed to update booking status.', 'Bookings');
                        });
                    }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 text-red-500 hover:text-red-600"
                    onClick={() => {
                      bookingService
                        .updateStatus(booking.id, 'CANCELLED')
                        .then(() => {
                          setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status: 'cancelled' } : b)));
                          showSuccess('Booking cancelled.', 'Bookings');
                        })
                        .catch((e) => {
                          console.error('Failed to cancel booking:', e);
                          showError('Failed to cancel booking.', 'Bookings');
                        });
                    }}
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </Button>
                </>
              )}

              {booking.status === "confirmed" && (
                <Button
                  size="sm"
                  className="bg-primary text-white"
                  onClick={() => {
                    bookingService
                      .updateStatus(booking.id, 'FINISHED')
                      .then(() => {
                        setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status: 'completed' } : b)));
                        showSuccess('Booking updated.', 'Bookings');
                      })
                      .catch((e) => {
                        console.error('Failed to update booking:', e);
                        showError('Failed to update booking status.', 'Bookings');
                      });
                  }}
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
            <div className="text-muted-foreground text-sm mb-2">Pending Requests</div>
            <div className="text-foreground text-3xl">{pendingBookings.length}</div>
          </Card>
          <Card className="p-6 border-border bg-card">
            <div className="text-muted-foreground text-sm mb-2">Completed Sessions</div>
            <div className="text-foreground text-3xl">{completedBookings.length}</div>
          </Card>
        </div>

        {isLoading && (
          <div className="text-sm text-muted-foreground mb-6">Loading bookings...</div>
        )}

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
