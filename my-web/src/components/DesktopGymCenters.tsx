import { useState } from "react";
import { Search, Star, MapPin, ArrowLeft, Users, Dumbbell, TrendingUp, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const gymCenters = [
  {
    id: 1,
    name: "PowerFit Training Center",
    owner: "Marcus Steel",
    location: "Downtown Los Angeles",
    rating: 4.9,
    reviews: 542,
    totalTrainers: 12,
    totalMembers: 2400,
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    logoImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200",
    description: "Elite personal training center with certified experts. Transform your body with our professional trainers.",
    specialties: ["Strength Training", "CrossFit", "HIIT"],
    verified: true,
    featured: true,
    openingHours: "5:00 AM - 11:00 PM"
  },
  {
    id: 2,
    name: "CrossFit Evolution",
    owner: "Sarah Power",
    location: "Santa Monica",
    rating: 4.8,
    reviews: 389,
    totalTrainers: 8,
    totalMembers: 1850,
    coverImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    logoImage: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=200",
    description: "Specialized CrossFit training with experienced coaches. Build strength, endurance and community.",
    specialties: ["CrossFit", "Olympic Lifting", "Cardio"],
    verified: true,
    featured: true,
    openingHours: "6:00 AM - 10:00 PM"
  },
  {
    id: 3,
    name: "Thunder Box Gym",
    owner: "Jake Thunder",
    location: "Venice Beach",
    rating: 4.7,
    reviews: 298,
    totalTrainers: 6,
    totalMembers: 1520,
    coverImage: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800",
    logoImage: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200",
    description: "Hardcore boxing and combat sports training. Get fight-ready with our expert trainers.",
    specialties: ["Boxing", "MMA", "Kickboxing"],
    verified: true,
    featured: false,
    openingHours: "7:00 AM - 9:00 PM"
  },
  {
    id: 4,
    name: "Zen Fitness Studio",
    owner: "Nina Flex",
    location: "Beverly Hills",
    rating: 4.9,
    reviews: 421,
    totalTrainers: 10,
    totalMembers: 2100,
    coverImage: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800",
    logoImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200",
    description: "Holistic approach to fitness combining yoga, pilates and strength training.",
    specialties: ["Yoga", "Pilates", "Wellness"],
    verified: true,
    featured: true,
    openingHours: "6:00 AM - 9:00 PM"
  },
  {
    id: 5,
    name: "Iron Temple",
    owner: "Rex Strongman",
    location: "Hollywood",
    rating: 4.8,
    reviews: 367,
    totalTrainers: 9,
    totalMembers: 1980,
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    logoImage: "https://images.unsplash.com/photo-1558151508-2f82a2f7a7a8?w=200",
    description: "Old-school bodybuilding and powerlifting gym. Build serious muscle with legendary coaches.",
    specialties: ["Bodybuilding", "Powerlifting", "Strength"],
    verified: true,
    featured: false,
    openingHours: "5:00 AM - 11:00 PM"
  },
  {
    id: 6,
    name: "Athletic Performance Lab",
    owner: "Lisa Peak",
    location: "Long Beach",
    rating: 4.9,
    reviews: 456,
    totalTrainers: 15,
    totalMembers: 2650,
    coverImage: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800",
    logoImage: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=200",
    description: "Sports performance and athletic training. Train like a pro athlete with our specialists.",
    specialties: ["Sports Performance", "Athletic Training", "Recovery"],
    verified: true,
    featured: true,
    openingHours: "5:00 AM - 10:00 PM"
  },
  {
    id: 7,
    name: "Urban Fitness Hub",
    owner: "Chris Urban",
    location: "Pasadena",
    rating: 4.6,
    reviews: 289,
    totalTrainers: 7,
    totalMembers: 1200,
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    logoImage: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=200",
    description: "Modern fitness facility with diverse training programs. Find your perfect trainer here.",
    specialties: ["HIIT", "Functional Training", "Cardio"],
    verified: false,
    featured: false,
    openingHours: "6:00 AM - 10:00 PM"
  },
  {
    id: 8,
    name: "Nutrition & Performance Center",
    owner: "Sarah Power",
    location: "Manhattan Beach",
    rating: 4.8,
    reviews: 312,
    totalTrainers: 11,
    totalMembers: 1890,
    coverImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    logoImage: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200",
    description: "Holistic fitness combining nutrition coaching and personal training.",
    specialties: ["Nutrition", "Weight Loss", "Muscle Gain"],
    verified: true,
    featured: false,
    openingHours: "6:00 AM - 9:00 PM"
  }
];

interface DesktopGymCentersProps {
  onBack: () => void;
  onGymClick: (gymId: number) => void;
}

export function DesktopGymCenters({ onBack, onGymClick }: DesktopGymCentersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "featured" | "verified">("all");

  const filteredGyms = gymCenters.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gym.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gym.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterType === "all" || 
                         (filterType === "featured" && gym.featured) ||
                         (filterType === "verified" && gym.verified);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button onClick={onBack} variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="text-center">
              <h1 className="text-foreground">Gym Training Centers</h1>
              <p className="text-muted-foreground text-sm">Find professional trainers at premium gyms</p>
            </div>

            <div className="w-[120px]"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search gym centers, location or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-card border-border"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                className={filterType === "all" ? "bg-primary text-white" : ""}
              >
                All Centers
              </Button>
              <Button
                variant={filterType === "featured" ? "default" : "outline"}
                onClick={() => setFilterType("featured")}
                className={filterType === "featured" ? "bg-primary text-white" : ""}
              >
                Featured
              </Button>
              <Button
                variant={filterType === "verified" ? "default" : "outline"}
                onClick={() => setFilterType("verified")}
                className={filterType === "verified" ? "bg-primary text-white" : ""}
              >
                Verified
              </Button>
            </div>
          </div>

          <p className="text-muted-foreground">
            {filteredGyms.length} training centers found
          </p>
        </div>

        {/* Gym Centers Grid */}
        <div className="grid grid-cols-2 gap-6">
          {filteredGyms.map((gym) => (
            <Card
              key={gym.id}
              className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-border bg-card group"
              onClick={() => onGymClick(gym.id)}
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={gym.coverImage}
                  alt={gym.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Logo */}
                <div className="absolute bottom-4 left-4">
                  <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg bg-card">
                    <ImageWithFallback
                      src={gym.logoImage}
                      alt={`${gym.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {gym.featured && (
                    <Badge className="bg-primary text-white border-0">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {gym.verified && (
                    <Badge className="bg-green-500 text-white border-0">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-foreground mb-1">{gym.name}</h3>
                  <p className="text-muted-foreground text-sm">by {gym.owner}</p>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground text-sm">{gym.location}</span>
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {gym.description}
                </p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {gym.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline" className="border-border text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                {/* Opening Hours */}
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{gym.openingHours}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-foreground">{gym.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{gym.reviews} reviews</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Dumbbell className="w-4 h-4 text-primary" />
                      <span className="text-foreground">{gym.totalTrainers}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Trainers</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-foreground">{gym.totalMembers.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Members</p>
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
