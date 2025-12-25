import { useState } from "react";
import { ArrowLeft, Star, MapPin, Calendar, Clock, Shield, Award, Users, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const trainerData = {
  name: "Marcus Steel",
  specialty: "Strength Training",
  location: "New York, NY",
  rating: 4.9,
  reviewCount: 234,
  clients: 450,
  experience: "8 years",
  image: "https://images.unsplash.com/photo-1643142313816-0d9c86c49f91?w=800",
  bio: "Elite strength coach specializing in powerlifting and muscle building. Certified NSCA-CPT with 8 years of experience transforming bodies and minds.",
  certifications: ["NSCA-CPT", "USAW Level 2", "Precision Nutrition"],
  packages: [
    { id: 1, name: "Single Session", price: 80, duration: "60 min", sessions: 1 },
    { id: 2, name: "Weekly Pack", price: 280, duration: "60 min", sessions: 4, popular: true },
    { id: 3, name: "Monthly Elite", price: 960, duration: "60 min", sessions: 16 }
  ],
  availability: [
    { day: "Mon", slots: ["6:00 AM", "7:00 AM", "5:00 PM", "6:00 PM"] },
    { day: "Wed", slots: ["6:00 AM", "7:00 AM", "5:00 PM"] },
    { day: "Fri", slots: ["6:00 AM", "7:00 AM", "6:00 PM"] }
  ],
  reviews: [
    { id: 1, name: "John D.", rating: 5, text: "Best trainer I've ever worked with! Transformed my body in 3 months.", date: "2 weeks ago" },
    { id: 2, name: "Sarah M.", rating: 5, text: "Marcus knows his stuff. Every session is challenging and effective.", date: "1 month ago" },
    { id: 3, name: "Mike R.", rating: 4, text: "Great trainer, very professional and knowledgeable.", date: "2 months ago" }
  ]
};

interface PTProfileProps {
  onBack: () => void;
  onBooking: () => void;
}

export function PTProfile({ onBack, onBooking }: PTProfileProps) {
  const [selectedPackage, setSelectedPackage] = useState(2);
  const [liked, setLiked] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Image */}
      <div className="relative h-72">
        <ImageWithFallback
          src={trainerData.image}
          alt={trainerData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Back Button */}
        <Button
          onClick={onBack}
          size="icon"
          className="absolute top-6 left-6 rounded-full bg-card/80 backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Like Button */}
        <Button
          onClick={() => setLiked(!liked)}
          size="icon"
          className="absolute top-6 right-6 rounded-full bg-card/80 backdrop-blur"
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-primary text-primary" : ""}`} />
        </Button>

        {/* Trainer Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-white mb-1">{trainerData.name}</h1>
              <p className="text-muted-foreground">{trainerData.specialty}</p>
            </div>
            <Badge className="bg-primary text-white border-0">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-6 py-4 border-b border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-white">{trainerData.rating}</span>
            </div>
            <p className="text-muted-foreground text-sm">{trainerData.reviewCount} reviews</p>
          </div>
          <div className="text-center border-x border-border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-white">{trainerData.clients}</span>
            </div>
            <p className="text-muted-foreground text-sm">Clients</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-white">{trainerData.experience}</span>
            </div>
            <p className="text-muted-foreground text-sm">Experience</p>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-6 py-6">
        <Tabs defaultValue="packages" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6 bg-card">
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="packages" className="space-y-4">
            {trainerData.packages.map((pkg) => (
              <Card
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`p-4 cursor-pointer transition-all rounded-2xl ${selectedPackage === pkg.id
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border"
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white">{pkg.name}</h3>
                    {pkg.popular && (
                      <Badge className="bg-primary text-white border-0 text-xs">Popular</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-white">${pkg.price}</div>
                    <div className="text-muted-foreground text-sm">${(pkg.price / pkg.sessions).toFixed(0)}/session</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{pkg.sessions} sessions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <Card className="p-5 bg-card border-border rounded-2xl">
              <h3 className="text-white mb-3">Bio</h3>
              <p className="text-muted-foreground">{trainerData.bio}</p>
            </Card>

            <Card className="p-5 bg-card border-border rounded-2xl">
              <h3 className="text-white mb-3">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {trainerData.certifications.map((cert, idx) => (
                  <Badge key={idx} className="bg-primary/20 text-primary border-0">
                    <Award className="w-3 h-3 mr-1" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-card border-border rounded-2xl">
              <h3 className="text-white mb-3">Location</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{trainerData.location}</span>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {trainerData.reviews.map((review) => (
              <Card key={review.id} className="p-4 bg-card border-border rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white">{review.name}</h4>
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-2">{review.text}</p>
                <p className="text-muted-foreground text-sm">{review.date}</p>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-card border-t border-border">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-muted-foreground text-sm">Selected Package</p>
            <p className="text-white">
              ${trainerData.packages.find(p => p.id === selectedPackage)?.price}
            </p>
          </div>
          <Button onClick={onBooking} className="flex-1 h-12 rounded-2xl bg-primary">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
