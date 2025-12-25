import { useState } from "react";
import { User, DollarSign, Calendar, Package, Plus, TrendingUp, Users, Award } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { MascotLogo } from "./MascotLogo";

const upcomingSessions = [
  { id: 1, client: "John Davis", time: "6:00 AM", date: "Nov 15", type: "Strength Training", paid: true },
  { id: 2, client: "Sarah Martinez", time: "7:00 AM", date: "Nov 15", type: "HIIT", paid: true },
  { id: 3, client: "Mike Roberts", time: "5:00 PM", date: "Nov 15", type: "Powerlifting", paid: false },
  { id: 4, client: "Emma Wilson", time: "6:00 PM", date: "Nov 16", type: "Strength Training", paid: true }
];

const myProducts = [
  { id: 1, name: "Premium Whey Protein", price: 49.99, stock: 24, sold: 156 },
  { id: 2, name: "Pre-Workout Energy", price: 39.99, stock: 31, sold: 124 }
];

const stats = {
  monthlyRevenue: 12480,
  totalClients: 450,
  sessionsThisMonth: 64,
  rating: 4.9
};

export function PTDashboard() {
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/20 to-background p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MascotLogo className="w-12 h-12" />
            <div>
              <h1 className="text-white">PT Dashboard</h1>
              <p className="text-muted-foreground text-sm">Marcus Steel</p>
            </div>
          </div>
          <Button size="icon" className="rounded-full bg-card">
            <User className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-card border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Revenue</p>
                <p className="text-white">${stats.monthlyRevenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary text-sm">
              <TrendingUp className="w-3 h-3" />
              <span>+12.5%</span>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Clients</p>
                <p className="text-white">{stats.totalClients}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary text-sm">
              <TrendingUp className="w-3 h-3" />
              <span>+8.2%</span>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Sessions</p>
                <p className="text-white">{stats.sessionsThisMonth}</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">This month</p>
          </Card>

          <Card className="p-4 bg-card border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Rating</p>
                <p className="text-white">{stats.rating}</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">234 reviews</p>
          </Card>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-6">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6 bg-card">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white">Upcoming Sessions</h2>
              <Button size="sm" className="rounded-xl bg-primary">
                <Plus className="w-4 h-4 mr-1" />
                Add Availability
              </Button>
            </div>

            {upcomingSessions.map((session) => (
              <Card key={session.id} className="p-4 bg-card border-border rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white mb-1">{session.client}</h3>
                    <p className="text-muted-foreground text-sm">{session.type}</p>
                  </div>
                  <Badge className={session.paid ? "bg-primary/20 text-primary border-0" : "bg-muted text-muted-foreground border-0"}>
                    {session.paid ? "Paid" : "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{session.time}</span>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white">My Packages</h2>
              <Button 
                onClick={() => setShowAddPackage(!showAddPackage)}
                size="sm" 
                className="rounded-xl bg-primary"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Package
              </Button>
            </div>

            {showAddPackage && (
              <Card className="p-5 bg-card border-border rounded-2xl mb-4">
                <h3 className="text-white mb-4">Create New Package</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="packageName">Package Name</Label>
                    <Input id="packageName" placeholder="e.g., Weekly Training" className="mt-2 h-12 rounded-2xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sessions">Sessions</Label>
                      <Input id="sessions" type="number" placeholder="4" className="mt-2 h-12 rounded-2xl" />
                    </div>
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input id="price" type="number" placeholder="280" className="mt-2 h-12 rounded-2xl" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Package details..." className="mt-2 rounded-2xl" />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => setShowAddPackage(false)} variant="secondary" className="flex-1 h-12 rounded-2xl">
                      Cancel
                    </Button>
                    <Button className="flex-1 h-12 rounded-2xl bg-primary">
                      Create Package
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-4 bg-card border-border rounded-2xl">
              <h3 className="text-white mb-2">Single Session</h3>
              <p className="text-muted-foreground text-sm mb-3">60 minutes individual training</p>
              <div className="flex items-center justify-between">
                <span className="text-primary">$80/session</span>
                <Button size="sm" variant="secondary" className="rounded-xl">Edit</Button>
              </div>
            </Card>

            <Card className="p-4 bg-card border-border rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-white">Weekly Pack</h3>
                <Badge className="bg-primary text-white border-0 text-xs">Popular</Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-3">4 sessions per week</p>
              <div className="flex items-center justify-between">
                <span className="text-primary">$280 ($70/session)</span>
                <Button size="sm" variant="secondary" className="rounded-xl">Edit</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white">My Products</h2>
              <Button 
                onClick={() => setShowAddProduct(!showAddProduct)}
                size="sm" 
                className="rounded-xl bg-primary"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Product
              </Button>
            </div>

            {showAddProduct && (
              <Card className="p-5 bg-card border-border rounded-2xl mb-4">
                <h3 className="text-white mb-4">List New Product</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="productName">Product Name</Label>
                    <Input id="productName" placeholder="e.g., Whey Protein" className="mt-2 h-12 rounded-2xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productPrice">Price ($)</Label>
                      <Input id="productPrice" type="number" placeholder="49.99" className="mt-2 h-12 rounded-2xl" />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input id="stock" type="number" placeholder="24" className="mt-2 h-12 rounded-2xl" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="productDesc">Description</Label>
                    <Textarea id="productDesc" placeholder="Product details..." className="mt-2 rounded-2xl" />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => setShowAddProduct(false)} variant="secondary" className="flex-1 h-12 rounded-2xl">
                      Cancel
                    </Button>
                    <Button className="flex-1 h-12 rounded-2xl bg-primary">
                      List Product
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {myProducts.map((product) => (
              <Card key={product.id} className="p-4 bg-card border-border rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white">{product.name}</h3>
                  <Button size="sm" variant="secondary" className="rounded-xl">Edit</Button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Price</p>
                    <p className="text-primary">${product.price}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Stock</p>
                    <p className="text-white">{product.stock}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Sold</p>
                    <p className="text-white">{product.sold}</p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
