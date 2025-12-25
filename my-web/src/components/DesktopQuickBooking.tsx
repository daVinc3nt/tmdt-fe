import { X, Search, Calendar, Clock, DollarSign, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ScrollArea } from "./ui/scroll-area";

interface DesktopQuickBookingProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrainer?: (trainerId: number) => void;
}

export function DesktopQuickBooking({ isOpen, onClose, onSelectTrainer }: DesktopQuickBookingProps) {
  const featuredTrainers = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialty: "Strength & Conditioning",
      rating: 4.9,
      price: 75,
      nextAvailable: "Today, 3:00 PM",
      image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400",
    },
    {
      id: 2,
      name: "Mike Chen",
      specialty: "HIIT & Weight Loss",
      rating: 4.8,
      price: 65,
      nextAvailable: "Tomorrow, 10:00 AM",
      image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      specialty: "Yoga & Flexibility",
      rating: 4.9,
      price: 60,
      nextAvailable: "Today, 6:00 PM",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
    },
    {
      id: 4,
      name: "Marcus Steel",
      specialty: "Bodybuilding",
      rating: 5.0,
      price: 85,
      nextAvailable: "Nov 8, 9:00 AM",
      image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400",
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Quick Booking Modal */}
        <Card 
          className="w-full max-w-4xl max-h-[80vh] rounded-[20px] border-border shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-border bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-foreground">Quick Book a Session</h2>
                <p className="text-muted-foreground text-sm">Choose from our available trainers</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Search */}
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, specialty, or location..."
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </div>

          <ScrollArea className="h-[500px]">
            <div className="p-6 grid grid-cols-2 gap-4">
              {featuredTrainers.map((trainer) => (
                <Card 
                  key={trainer.id} 
                  className="rounded-[20px] border-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => {
                    onSelectTrainer?.(trainer.id);
                    onClose();
                  }}
                >
                  <div className="flex gap-4 p-4">
                    <div className="w-24 h-24 rounded-[12px] overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={trainer.image}
                        alt={trainer.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-foreground">{trainer.name}</h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span className="text-foreground text-sm">{trainer.rating}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{trainer.specialty}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Next: {trainer.nextAvailable}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>${trainer.price}/session</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-primary text-white mt-3"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTrainer?.(trainer.id);
                          onClose();
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border bg-white flex justify-center">
            <Button variant="outline" onClick={() => {
              onClose();
              // Navigate to full trainer list
            }}>
              <Search className="w-4 h-4 mr-2" />
              View All Trainers
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
