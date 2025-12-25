import { useState } from "react";
import { MapPin, Star, Filter, ChevronRight, Dumbbell, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

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
  },
  {
    id: 5,
    name: "Alex Storm",
    specialty: "Boxing",
    location: "Boston, MA",
    rating: 4.8,
    reviews: 142,
    price: 85,
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400",
    verified: true
  },
  {
    id: 6,
    name: "Lisa Champion",
    specialty: "Nutrition",
    location: "Seattle, WA",
    rating: 4.9,
    reviews: 201,
    price: 90,
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400",
    verified: true
  }
];

const categories = ["All Trainers", "Strength", "CrossFit", "HIIT", "Yoga", "Boxing", "Nutrition"];

const featuredProducts = [
  {
    id: 1,
    name: "Premium Whey Protein",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1709976142774-ce1ef41a8378?w=300",
    rating: 4.8
  },
  {
    id: 2,
    name: "Adjustable Dumbbells",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1652492041264-efba848755d6?w=300",
    rating: 4.9
  },
  {
    id: 3,
    name: "Performance Tank Top",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1558151507-c1aa3d917dbb?w=300",
    rating: 4.7
  }
];

interface DesktopCustomerHomeProps {
  onTrainerSelect: (trainerId: number) => void;
  onMarketplaceClick: () => void;
}

export function DesktopCustomerHome({ onTrainerSelect, onMarketplaceClick }: DesktopCustomerHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Trainers");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-foreground mb-4 text-5xl">
                Transform Your <span className="text-primary">Fitness Journey</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Connect with elite personal trainers and access premium gym equipment. Start your transformation today.
              </p>
              <div className="flex gap-4">
                <Button className="bg-primary text-white h-12 px-8">
                  <Dumbbell className="w-5 h-5 mr-2" />
                  Find a Trainer
                </Button>
                <Button variant="outline" className="h-12 px-8 border-border">
                  Shop Products
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-primary text-3xl">450+</div>
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">Active Trainers</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-primary text-3xl">12K+</div>
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">Happy Clients</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-primary text-3xl">4.9</div>
                    <Star className="w-5 h-5 fill-primary text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">Average Rating</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1643142313816-0d9c86c49f91?w=600"
                alt="Fitness trainer"
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters and Categories */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-foreground">Top Trainers</h2>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-primary text-white" : "border-border"}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select defaultValue="rating">
              <SelectTrigger className="w-40 bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="border-border">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          {trainers.map((trainer) => (
            <Card
              key={trainer.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border-border bg-card group"
              onClick={() => onTrainerSelect(trainer.id)}
            >
              <div className="relative h-48">
                <ImageWithFallback
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {trainer.verified && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-foreground mb-1">{trainer.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{trainer.specialty}</p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-foreground text-sm">{trainer.rating}</span>
                    <span className="text-muted-foreground text-sm">({trainer.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="w-3 h-3" />
                    <span>{trainer.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <span className="text-primary text-lg">${trainer.price}</span>
                    <span className="text-muted-foreground text-sm">/session</span>
                  </div>
                  <Button size="sm" className="bg-primary text-white">
                    Book Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Featured Products */}
        <div className="border-t border-border pt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-foreground">Featured Products</h2>
            <Button variant="ghost" onClick={onMarketplaceClick} className="text-primary">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border-border bg-card group">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4">
                  <h3 className="text-foreground mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-foreground text-sm">{product.rating}</span>
                    </div>
                    <span className="text-primary">${product.price}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
