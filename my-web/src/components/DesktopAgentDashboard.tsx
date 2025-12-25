import { useState } from "react";
import { DollarSign, Package, TrendingUp, ShoppingBag, Plus, Edit, Trash2, Dumbbell } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Gym {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  productCount: number;
  revenue: number;
  totalSales: number;
}

interface DesktopAgentDashboardProps {
  onAddGym: () => void;
  onGymClick: (gymId: number) => void;
}

export function DesktopAgentDashboard({ onAddGym, onGymClick }: DesktopAgentDashboardProps) {
  const [myGyms, setMyGyms] = useState<Gym[]>([
    {
      id: 1,
      name: "PowerFit Training Center",
      location: "New York, NY",
      description: "Premium strength training and bodybuilding facility",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600",
      productCount: 12,
      revenue: 45680,
      totalSales: 234
    }
  ]);

  // Calculate total stats from all gyms
  const totalRevenue = myGyms.reduce((sum, gym) => sum + gym.revenue, 0);
  const totalProducts = myGyms.reduce((sum, gym) => sum + gym.productCount, 0);
  const totalSales = myGyms.reduce((sum, gym) => sum + gym.totalSales, 0);

  const stats = [
    {
      id: 1,
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: "+15.3%",
      color: "bg-primary/10 text-primary"
    },
    {
      id: 2,
      label: "Active Products",
      value: totalProducts.toString(),
      icon: Package,
      trend: "+8.2%",
      color: "bg-primary/10 text-primary"
    },
    {
      id: 3,
      label: "Total Sales",
      value: totalSales.toString(),
      icon: ShoppingBag,
      trend: "+12.5%",
      color: "bg-primary/10 text-primary"
    },
    {
      id: 4,
      label: "My Gyms",
      value: myGyms.length.toString(),
      icon: Dumbbell,
      trend: "Active",
      color: "bg-primary/10 text-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/5 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-muted-foreground text-sm">Welcome back,</h2>
              <h1 className="text-foreground">FitGear Agent</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.id} className="p-6 border-border bg-card">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-[12px] ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-foreground mb-1">{stat.value}</h3>
              <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm">{stat.trend}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* My Gyms Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-foreground">My Gym Centers</h2>
            <Button 
              onClick={onAddGym}
              className="bg-primary text-white gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Gym Center
            </Button>
          </div>

          {myGyms.length === 0 ? (
            <Card className="p-12 text-center border-border bg-card">
              <Dumbbell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-foreground mb-2">No Gym Centers Yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your first gym center to start selling products on the marketplace
              </p>
              <Button 
                onClick={onAddGym}
                className="bg-primary text-white gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Gym
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {myGyms.map((gym) => (
                <Card 
                  key={gym.id} 
                  className="overflow-hidden border-border bg-card hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => onGymClick(gym.id)}
                >
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={gym.image}
                      alt={gym.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white mb-1">{gym.name}</h3>
                      <p className="text-white/80 text-sm">{gym.location}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-muted-foreground text-sm mb-4">{gym.description}</p>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Products</p>
                        <p className="text-foreground">{gym.productCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Revenue</p>
                        <p className="text-foreground">${(gym.revenue / 1000).toFixed(1)}k</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Sales</p>
                        <p className="text-foreground">{gym.totalSales}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onGymClick(gym.id);
                        }}
                        className="flex-1 bg-primary text-white"
                      >
                        Manage Products
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit gym functionality
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <Card className="p-6 border-border bg-card">
          <h3 className="text-foreground mb-4">Performance Overview</h3>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Avg. Revenue per Gym</p>
              <p className="text-foreground text-2xl">
                ${myGyms.length > 0 ? (totalRevenue / myGyms.length).toFixed(0) : 0}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-2">Avg. Products per Gym</p>
              <p className="text-foreground text-2xl">
                {myGyms.length > 0 ? (totalProducts / myGyms.length).toFixed(0) : 0}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-2">Pending Orders</p>
              <p className="text-foreground text-2xl">12</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-2">This Month Growth</p>
              <p className="text-primary text-2xl">+15.3%</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
