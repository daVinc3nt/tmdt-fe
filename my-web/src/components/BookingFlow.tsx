import { useState } from "react";
import { ArrowLeft, Calendar, Clock, CreditCard, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { bookingService } from "../services/ptService";
import { useAuth } from "../context/AuthContext";

// Helper function để decode JWT và lấy userId
const getUserIdFromToken = (token: string | null): number | null => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.userId || null;
  } catch (error) {
    console.error("Lỗi decode JWT:", error);
    return null;
  }
};

const timeSlots = [
  { label: "6:00 AM", value: "06:00" },
  { label: "7:00 AM", value: "07:00" },
  { label: "8:00 AM", value: "08:00" },
  { label: "9:00 AM", value: "09:00" },
  { label: "5:00 PM", value: "17:00" },
  { label: "6:00 PM", value: "18:00" },
  { label: "7:00 PM", value: "19:00" },
  { label: "8:00 PM", value: "20:00" }
];

const dates = [
  { date: "2025-12-24", day: "Tue", available: false },
  { date: "2025-12-25", day: "Wed", available: true },
  { date: "2025-12-26", day: "Sat", available: true },
  { date: "2025-12-27", day: "Sun", available: true }
];


interface BookingFlowProps {
  bookingContext: {
    trainerId: number;
    trainerName: string;
    price: number;
  };
  onBack: () => void;
}



export function BookingFlow({ onBack, bookingContext }: BookingFlowProps) {
  const { token } = useAuth();
  const { trainerId, trainerName, price } = bookingContext;
  const [selectedDate, setSelectedDate] = useState(
    dates.find(d => d.available)?.date || ""
  );

  const [selectedTime, setSelectedTime] = useState(
    timeSlots[0].value
  );

  const [bookingComplete, setBookingComplete] = useState(false);

  const handlePayment = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Vui lòng chọn ngày và giờ");
      return;
    }

    // Lấy traineeId từ JWT token
    const traineeIdFromToken = getUserIdFromToken(token);
    if (!traineeIdFromToken) {
      alert("Không thể xác thực người dùng. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      await bookingService.createBooking({
        traineeId: traineeIdFromToken,
        packageId: trainerId,
        date: buildBookingDateISO(),
        totalAmount: price
      });

      setBookingComplete(true);
    } catch (error) {
      console.error("Booking failed FULL:", error);
      alert("Đặt lịch thất bại (xem console)");
    }
  };

  const buildBookingDateISO = () => {
    const local = new Date(`${selectedDate}T${selectedTime}:00`);
    return local.toISOString(); // ⭐ RẤT QUAN TRỌNG
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);


  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8 bg-card border-border rounded-[20px] text-center max-w-md w-full">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-foreground mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-6">
            Your training session with Marcus Steel has been booked for Nov {selectedDate} at {selectedTime}
          </p>
          <Button onClick={onBack} className="w-full bg-primary text-white rounded-[12px]">
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button onClick={onBack} variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Booking Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-foreground mb-2">Book Training Session</h1>
              <p className="text-muted-foreground">Complete your booking in one simple form</p>
            </div>

            {/* Date & Time Selection */}
            <Card className="p-6 border-border rounded-[20px]">
              <h3 className="text-foreground mb-4">Choose your preferred training day</h3>

              <div className="grid grid-cols-4 gap-3 mb-6">
                {dates.map((d) => (
                  <button
                    key={d.date}
                    onClick={() => d.available && setSelectedDate(d.date)}
                    disabled={!d.available}
                    className={`p-4 rounded-[12px] text-center transition-all ${selectedDate === d.date
                      ? "bg-primary text-white"
                      : d.available
                        ? "bg-secondary hover:bg-secondary/80 text-foreground"
                        : "bg-secondary/30 text-muted-foreground cursor-not-allowed"
                      }`}
                  >
                    <div className="text-xs mb-1">{d.day}</div>
                    <div className="text-xl">{d.date.slice(-2)}</div>
                  </button>
                ))}
              </div>

              <div className="border-t border-border pt-6">
                <h4 className="text-foreground mb-3">Available time slots</h4>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((t) => (
                    <Button
                      key={t.value}
                      onClick={() => setSelectedTime(t.value)}
                      variant={selectedTime === t.value ? "default" : "outline"}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {t.label}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Payment Details */}
            {/* <Card className="p-6 border-border rounded-[20px]">
              <h3 className="text-foreground mb-4">Enter your payment details</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber" className="text-foreground">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="mt-2 rounded-[12px] border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry" className="text-foreground">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="mt-2 rounded-[12px] border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-foreground">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="mt-2 rounded-[12px] border-border"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="name" className="text-foreground">Cardholder Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="mt-2 rounded-[12px] border-border"
                  />
                </div>
              </div>
            </Card> */}
          </div>

          {/* Right Column - Booking Summary (Sticky) */}
          <div>
            <div className="sticky top-8">
              <Card className="p-6 border-border rounded-[20px]">
                <h3 className="text-foreground mb-4">Confirm your session details</h3>
                <p className="text-muted-foreground text-sm mb-6">Review booking information</p>

                <div className="bg-secondary/50 rounded-[12px] p-4 mb-6">
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
                    <div className="w-12 h-12 bg-primary/20 rounded-[12px] flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-foreground">Training Session</h4>
                      <p className="text-muted-foreground text-sm">with {trainerName}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Date</span>
                      <span className="text-foreground">Nov {selectedDate}, 2025</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Time</span>
                      <span className="text-foreground">{selectedTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="text-foreground">60 minutes</span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary rounded-[12px] p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <span className="text-foreground">Total</span>
                    </div>
                    <span className="text-primary text-xl">{formatCurrency(price)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full bg-primary text-white rounded-[12px]"
                >
                  Pay Now
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By confirming, you agree to our terms and conditions
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
