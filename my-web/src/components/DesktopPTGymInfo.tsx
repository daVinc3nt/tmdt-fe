import { ArrowLeft, MapPin, Phone, Mail, Clock, Dumbbell, Users, Award, Globe } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DesktopPTGymInfoProps {
  onBack: () => void;
}

const gymInfo = {
  name: "PowerFit Training Center",
  location: "New York, NY",
  address: "123 Fitness Avenue, Manhattan, NY 10001",
  phone: "(555) 123-4567",
  email: "info@powerfit.com",
  website: "www.powerfit.com",
  image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
  description: "PowerFit Training Center is a premier fitness facility dedicated to strength training and bodybuilding. We provide state-of-the-art equipment and world-class trainers to help you achieve your fitness goals.",
  facilities: [
    "Olympic Weightlifting Area",
    "Cardio Zone with Latest Equipment",
    "Functional Training Space",
    "Private Training Rooms",
    "Locker Rooms with Showers",
    "Nutrition Bar"
  ],
  hours: [
    { day: "Monday - Friday", hours: "5:00 AM - 11:00 PM" },
    { day: "Saturday - Sunday", hours: "6:00 AM - 10:00 PM" }
  ],
  stats: {
    members: 1250,
    trainers: 18,
    rating: 4.8
  }
};

const otherTrainers = [
  {
    id: 1,
    name: "Jessica Moore",
    specialty: "Yoga & Pilates",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400",
    rating: 4.9
  },
  {
    id: 2,
    name: "David Kim",
    specialty: "CrossFit",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400",
    rating: 4.7
  },
  {
    id: 3,
    name: "Lisa Anderson",
    specialty: "Nutrition Coaching",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    rating: 4.8
  },
  {
    id: 4,
    name: "Ryan Thompson",
    specialty: "HIIT Training",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
    rating: 4.6
  }
];

export function DesktopPTGymInfo({ onBack }: DesktopPTGymInfoProps) {
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

          <h1 className="text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Independent Personal Trainer</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Other Trainers Section Only */}
        <Card className="p-6 border-border bg-card">
          <h3 className="text-foreground mb-4">Other Independent Trainers</h3>
          <div className="grid grid-cols-4 gap-4">
            {otherTrainers.map((trainer) => (
              <div key={trainer.id} className="flex flex-col gap-3 p-4 border border-border rounded-[12px] bg-background">
                <div className="w-full aspect-square rounded-full overflow-hidden">
                  <ImageWithFallback
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-foreground text-sm mb-1">{trainer.name}</h4>
                  <p className="text-muted-foreground text-xs mb-2">{trainer.specialty}</p>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3 text-primary" />
                    <span className="text-primary text-xs">{trainer.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}