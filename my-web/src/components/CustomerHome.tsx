import { useState } from "react";
import { Search, MapPin, Star, Filter, DollarSign, Dumbbell, Heart } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MascotLogo } from "./MascotLogo";

const trainers = [
  {
    id: 1,
    name: "Marcus Steel",
    specialty: "Strength Training",
    location: "New York, NY",
    rating: 4.9,
    reviews: 234,
    price: 80,
    image: "https://images.unsplash.com/photo-1643142313816-0d9c86c49f91?w=400",
    verified: true
  },
  {
    id: 2,
    name: "Sarah Power",
    specialty: "CrossFit",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviews: 187,
    price: 75,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    verified: true
  },
  {
    id: 3,
    name: "Jake Thunder",
    specialty: "HIIT & Cardio",
    location: "Chicago, IL",
    rating: 4.7,
    reviews: 156,
    price: 65,
    image: "https://images.unsplash.com/photo-1567598508481-65985588e295?w=400",
    verified: true
  },
  {
    id: 4,
    name: "Nina Flex",
    specialty: "Yoga & Mobility",
    location: "Miami, FL",
    rating: 4.9,
    reviews: 298,
    price: 70,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    verified: true
  }
];

const categories = ["All", "Strength", "CrossFit", "HIIT", "Yoga", "Boxing", "Nutrition"];

interface CustomerHomeProps {
  onTrainerSelect: (trainerId: number) => void;
  onMarketplaceClick: () => void;
}

export function CustomerHome({ onTrainerSelect, onMarketplaceClick }: CustomerHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/20 to-background p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MascotLogo className="w-12 h-12" />
            <div>
              <h1 className="text-white">FitConnect</h1>
              <p className="text-muted-foreground text-sm">Find Your Strength</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <Heart className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search trainers, specialties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-14 bg-card border-border rounded-2xl"
          />
          <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary">
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">New York, NY</span>
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-gradient-to-br from-primary to-primary/80 border-0 cursor-pointer hover:scale-105 transition-transform">
            <Dumbbell className="w-8 h-8 text-white mb-2" />
            <h3 className="text-white">Book Session</h3>
            <p className="text-white/80 text-sm">Find a trainer</p>
          </Card>
          <Card 
            onClick={onMarketplaceClick}
            className="p-4 bg-gradient-to-br from-secondary to-card border-border cursor-pointer hover:scale-105 transition-transform"
          >
            <DollarSign className="w-8 h-8 text-primary mb-2" />
            <h3 className="text-white">Marketplace</h3>
            <p className="text-muted-foreground text-sm">Shop products</p>
          </Card>
        </div>
      </div>

      {/* Trainers List */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white">Top Trainers</h2>
          <Button variant="ghost" className="text-primary">View All</Button>
        </div>

        <div className="space-y-4">
          {trainers.map((trainer) => (
            <Card
              key={trainer.id}
              onClick={() => onTrainerSelect(trainer.id)}
              className="p-4 bg-card border-border cursor-pointer hover:border-primary transition-all rounded-2xl"
            >
              <div className="flex gap-4">
                <div className="relative">
                  <ImageWithFallback
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  {trainer.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-white mb-1">{trainer.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{trainer.specialty}</p>
                  
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-white text-sm">{trainer.rating}</span>
                      <span className="text-muted-foreground text-sm">({trainer.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="text-sm">{trainer.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/20 text-primary border-0">
                      ${trainer.price}/session
                    </Badge>
                    <Button size="sm" className="rounded-xl bg-primary">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
