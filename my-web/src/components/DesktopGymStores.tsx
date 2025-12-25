import { useState } from "react";
import { Search, Star, MapPin, ArrowLeft, Users, Package, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const gymStores = [
  {
    id: 1,
    name: "PowerFit Gym & Nutrition",
    owner: "Marcus Steel",
    location: "Downtown Los Angeles",
    rating: 4.9,
    reviews: 342,
    totalProducts: 156,
    totalMembers: 2400,
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    logoImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200",
    description: "Premium fitness equipment and supplements. Professional grade products for serious athletes.",
    categories: ["Equipment", "Supplements", "Apparel"],
    verified: true,
    featured: true
  },
  {
    id: 2,
    name: "FitGear Pro Shop",
    owner: "FitGear Agent",
    location: "Santa Monica",
    rating: 4.8,
    reviews: 289,
    totalProducts: 203,
    totalMembers: 1850,
    coverImage: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800",
    logoImage: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=200",
    description: "Your one-stop shop for quality gym apparel and accessories. Affordable prices, premium quality.",
    categories: ["Apparel", "Accessories", "Equipment"],
    verified: true,
    featured: true
  },
  {
    id: 3,
    name: "Thunder Fitness Store",
    owner: "Jake Thunder",
    location: "Venice Beach",
    rating: 4.7,
    reviews: 198,
    totalProducts: 124,
    totalMembers: 1520,
    coverImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    logoImage: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200",
    description: "Specialized in resistance training equipment and functional fitness gear.",
    categories: ["Equipment", "Training Gear"],
    verified: true,
    featured: false
  },
  {
    id: 4,
    name: "Nutrition Hub",
    owner: "Sarah Power",
    location: "Beverly Hills",
    rating: 4.9,
    reviews: 421,
    totalProducts: 187,
    totalMembers: 2100,
    coverImage: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800",
    logoImage: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200",
    description: "Premium supplements and nutrition products. Science-backed formulations for optimal performance.",
    categories: ["Supplements", "Nutrition", "Vitamins"],
    verified: true,
    featured: true
  },
  {
    id: 5,
    name: "Flex Fitness Emporium",
    owner: "Nina Flex",
    location: "Hollywood",
    rating: 4.6,
    reviews: 167,
    totalProducts: 98,
    totalMembers: 980,
    coverImage: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
    logoImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200",
    description: "Yoga, pilates, and wellness products. Create your perfect zen fitness space.",
    categories: ["Yoga", "Pilates", "Wellness"],
    verified: true,
    featured: false
  },
  {
    id: 6,
    name: "Muscle Factory",
    owner: "Rex Strongman",
    location: "Long Beach",
    rating: 4.8,
    reviews: 256,
    totalProducts: 143,
    totalMembers: 1650,
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    logoImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200",
    description: "Heavy-duty equipment for serious lifters. Built to last, designed to perform.",
    categories: ["Equipment", "Supplements", "Training"],
    verified: true,
    featured: false
  },
  {
    id: 7,
    name: "Urban Athletics",
    owner: "Chris Urban",
    location: "Pasadena",
    rating: 4.7,
    reviews: 189,
    totalProducts: 112,
    totalMembers: 1200,
    coverImage: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800",
    logoImage: "https://images.unsplash.com/photo-1558151508-2f82a2f7a7a8?w=200",
    description: "Modern fitness apparel and street-style workout gear. Look good, feel great.",
    categories: ["Apparel", "Streetwear", "Accessories"],
    verified: false,
    featured: false
  },
  {
    id: 8,
    name: "Peak Performance Store",
    owner: "Lisa Peak",
    location: "Manhattan Beach",
    rating: 4.9,
    reviews: 312,
    totalProducts: 165,
    totalMembers: 1890,
    coverImage: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800",
    logoImage: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=200",
    description: "Elite training equipment and recovery products for peak athletic performance.",
    categories: ["Equipment", "Recovery", "Tech"],
    verified: true,
    featured: true
  }
];

interface DesktopGymStoresProps {
  onBack: () => void;
  onGymClick: (gymId: number) => void;
}

export function DesktopGymStores({ onBack, onGymClick }: DesktopGymStoresProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "featured" | "verified">("all");

  const filteredGyms = gymStores.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gym.location.toLowerCase().includes(searchQuery.toLowerCase());
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
              <h1 className="text-foreground">Gym Stores</h1>
              <p className="text-muted-foreground text-sm">Discover premium gym stores near you</p>
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
                placeholder="Search gym stores or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-card border-border rounded-[12px]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                className={filterType === "all" ? "bg-primary text-white rounded-[12px]" : "rounded-[12px]"}
              >
                All stores
              </Button>
              <Button
                variant={filterType === "featured" ? "default" : "outline"}
                onClick={() => setFilterType("featured")}
                className={filterType === "featured" ? "bg-primary text-white rounded-[12px]" : "rounded-[12px]"}
              >
                Featured
              </Button>
              <Button
                variant={filterType === "verified" ? "default" : "outline"}
                onClick={() => setFilterType("verified")}
                className={filterType === "verified" ? "bg-primary text-white rounded-[12px]" : "rounded-[12px]"}
              >
                Verified
              </Button>
            </div>
          </div>

          <p className="text-muted-foreground">
            {filteredGyms.length} gym stores found
          </p>
        </div>

        {/* Gym Stores Grid */}
        <div className="grid grid-cols-2 gap-6">
          {filteredGyms.map((gym) => (
            <Card
              key={gym.id}
              className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-border bg-card group rounded-[20px]"
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
                  <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
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

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {gym.categories.map((category) => (
                    <Badge key={category} variant="outline" className="border-border text-xs">
                      {category}
                    </Badge>
                  ))}
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
                      <Package className="w-4 h-4 text-primary" />
                      <span className="text-foreground">{gym.totalProducts}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Products</p>
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