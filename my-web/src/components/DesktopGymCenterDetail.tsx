import { useState } from "react";
import { ArrowLeft, Star, MapPin, Users, Dumbbell, Phone, Mail, Globe, Search, Shield, Clock, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Mock data for gym centers with trainers
const gymCentersData: Record<number, any> = {
  1: {
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
    phone: "+1 (310) 555-0123",
    email: "contact@powerfit.com",
    website: "www.powerfit.com",
    openingHours: "5:00 AM - 11:00 PM",
    verified: true,
    trainers: [
      {
        id: 1,
        name: "Marcus Steel",
        specialty: "Strength Training",
        rating: 4.9,
        reviews: 234,
        price: 80,
        location: "New York, NY",
        image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400",
        favorite: false
      },
      {
        id: 4,
        name: "Nina Flex",
        specialty: "Yoga & Mobility",
        rating: 4.9,
        reviews: 298,
        price: 70,
        location: "Miami, FL",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
        favorite: true
      },
      {
        id: 6,
        name: "Lisa Champion",
        specialty: "Nutrition",
        rating: 4.9,
        reviews: 201,
        price: 90,
        location: "Seattle, WA",
        image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400",
        favorite: false
      }
    ]
  },
  2: {
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
    phone: "+1 (310) 555-0456",
    email: "info@crossfitevolution.com",
    website: "www.crossfitevolution.com",
    openingHours: "6:00 AM - 10:00 PM",
    verified: true,
    trainers: [
      {
        id: 2,
        name: "Sarah Power",
        specialty: "CrossFit",
        rating: 4.8,
        reviews: 187,
        price: 75,
        location: "Los Angeles, CA",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        favorite: true
      },
      {
        id: 5,
        name: "Alex Storm",
        specialty: "Boxing",
        rating: 4.8,
        reviews: 142,
        price: 85,
        location: "Boston, MA",
        image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400",
        favorite: false
      }
    ]
  },
  3: {
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
    phone: "+1 (424) 555-0789",
    email: "hello@thunderbox.com",
    website: "www.thunderbox.com",
    openingHours: "7:00 AM - 9:00 PM",
    verified: true,
    trainers: [
      {
        id: 3,
        name: "Jake Thunder",
        specialty: "HIIT & Cardio",
        rating: 4.7,
        reviews: 158,
        price: 65,
        location: "Chicago, IL",
        image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=400",
        favorite: false
      },
      {
        id: 5,
        name: "Alex Storm",
        specialty: "Boxing",
        rating: 4.8,
        reviews: 142,
        price: 85,
        location: "Boston, MA",
        image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400",
        favorite: false
      }
    ]
  },
  4: {
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
    phone: "+1 (310) 555-0999",
    email: "hello@zenfitness.com",
    website: "www.zenfitness.com",
    openingHours: "6:00 AM - 9:00 PM",
    verified: true,
    trainers: [
      {
        id: 4,
        name: "Nina Flex",
        specialty: "Yoga & Mobility",
        rating: 4.9,
        reviews: 298,
        price: 70,
        location: "Miami, FL",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
        favorite: true
      },
      {
        id: 6,
        name: "Lisa Champion",
        specialty: "Nutrition",
        rating: 4.9,
        reviews: 201,
        price: 90,
        location: "Seattle, WA",
        image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400",
        favorite: false
      }
    ]
  }
};

interface DesktopGymCenterDetailProps {
  gymId: number;
  onBack: () => void;
  onTrainerClick: (trainerId: number) => void;
}

export function DesktopGymCenterDetail({ gymId, onBack, onTrainerClick }: DesktopGymCenterDetailProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);

  const gym = gymCentersData[gymId];

  if (!gym) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center border-border bg-card">
          <h2 className="text-foreground mb-4">Gym Center Not Found</h2>
          <Button onClick={onBack} className="bg-primary text-white">
            Back to Gym Centers
          </Button>
        </Card>
      </div>
    );
  }

  const filteredTrainers = gym.trainers.filter((t: any) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || t.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  const toggleFavorite = (trainerId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(trainerId) 
        ? prev.filter(id => id !== trainerId)
        : [...prev, trainerId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button onClick={onBack} variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Gym Centers
          </Button>
        </div>
      </div>

      {/* Gym Header */}
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={gym.coverImage}
          alt={gym.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 pb-6">
            <div className="flex items-end gap-6">
              {/* Logo */}
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-xl bg-card">
                <ImageWithFallback
                  src={gym.logoImage}
                  alt={`${gym.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-white">{gym.name}</h1>
                  {gym.verified && (
                    <Badge className="bg-green-500 text-white border-0">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-white/90 mb-3">by {gym.owner}</p>
                <div className="flex items-center gap-6 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{gym.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span>{gym.rating} ({gym.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4" />
                    <span>{gym.totalTrainers} Trainers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{gym.totalMembers.toLocaleString()} Members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{gym.openingHours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* About Center */}
            <Card className="p-5 border-border bg-card">
              <h3 className="text-foreground mb-3">About Center</h3>
              <p className="text-muted-foreground text-sm mb-4">{gym.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{gym.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{gym.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4 text-primary" />
                  <span>{gym.website}</span>
                </div>
              </div>
            </Card>

            {/* Search */}
            <Card className="p-5 border-border bg-card">
              <h3 className="text-foreground mb-4">Search Trainers</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
            </Card>

            {/* Specialties */}
            <Card className="p-5 border-border bg-card">
              <h3 className="text-foreground mb-4">Specialties</h3>
              <Tabs value={selectedSpecialty} onValueChange={setSelectedSpecialty} className="w-full" orientation="vertical">
                <TabsList className="w-full flex-col h-auto bg-transparent gap-2">
                  <TabsTrigger value="all" className="w-full justify-start">All Trainers</TabsTrigger>
                  <TabsTrigger value="strength" className="w-full justify-start">Strength Training</TabsTrigger>
                  <TabsTrigger value="crossfit" className="w-full justify-start">CrossFit</TabsTrigger>
                  <TabsTrigger value="yoga" className="w-full justify-start">Yoga & Mobility</TabsTrigger>
                  <TabsTrigger value="boxing" className="w-full justify-start">Boxing</TabsTrigger>
                  <TabsTrigger value="nutrition" className="w-full justify-start">Nutrition</TabsTrigger>
                </TabsList>
              </Tabs>
            </Card>
          </div>

          {/* Trainers Grid */}
          <div className="col-span-3">
            <div className="mb-6">
              <p className="text-muted-foreground">{filteredTrainers.length} trainers available</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {filteredTrainers.map((trainer: any) => (
                <Card
                  key={trainer.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border-border bg-card group"
                  onClick={() => onTrainerClick(trainer.id)}
                >
                  <div className="relative h-64">
                    <ImageWithFallback
                      src={trainer.image}
                      alt={trainer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(trainer.id, e)}
                      className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-lg"
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          favorites.includes(trainer.id) || trainer.favorite
                            ? "fill-primary text-primary" 
                            : "text-muted-foreground"
                        }`} 
                      />
                    </button>

                    {/* Gym Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-lg bg-card">
                        <ImageWithFallback
                          src={gym.logoImage}
                          alt={gym.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-foreground mb-1">{trainer.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{trainer.specialty}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="text-foreground text-sm">{trainer.rating}</span>
                      </div>
                      <span className="text-muted-foreground text-sm">({trainer.reviews})</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">{trainer.location}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-primary text-xl">${trainer.price}</span>
                        <span className="text-muted-foreground text-sm">/session</span>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTrainerClick(trainer.id);
                        }}
                        size="sm"
                        className="bg-primary text-white"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredTrainers.length === 0 && (
              <Card className="p-12 text-center border-border bg-card">
                <Dumbbell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-foreground mb-2">No Trainers Found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
