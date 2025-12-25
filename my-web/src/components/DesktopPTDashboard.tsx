import { useState } from "react";
import { DollarSign, Calendar, Users, Award, TrendingUp, Plus } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const upcomingSessions = [
  { id: 1, client: "John Davis", time: "6:00 AM", date: "Nov 15", type: "Strength Training", paid: true },
  { id: 2, client: "Sarah Martinez", time: "7:00 AM", date: "Nov 15", type: "HIIT", paid: true },
  { id: 3, client: "Mike Roberts", time: "5:00 PM", date: "Nov 15", type: "Powerlifting", paid: false },
  { id: 4, client: "Emma Wilson", time: "6:00 PM", date: "Nov 16", type: "Strength Training", paid: true },
  { id: 5, client: "Alex Chen", time: "7:00 AM", date: "Nov 16", type: "CrossFit", paid: true }
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

const revenueData = [
  { month: "Jan", revenue: 8400 },
  { month: "Feb", revenue: 9200 },
  { month: "Mar", revenue: 10100 },
  { month: "Apr", revenue: 9800 },
  { month: "May", revenue: 11200 },
  { month: "Jun", revenue: 12480 }
];

export function DesktopPTDashboard() {
  const [showAddPackage, setShowAddPackage] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground mb-2">PT Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Marcus Steel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <Badge className="bg-primary/20 text-primary border-0">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5%
              </Badge>
            </div>
            <div className="text-muted-foreground text-sm mb-1">Monthly Revenue</div>
            <div className="text-foreground text-2xl">${stats.monthlyRevenue.toLocaleString()}</div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <Badge className="bg-primary/20 text-primary border-0">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8.2%
              </Badge>
            </div>
            <div className="text-muted-foreground text-sm mb-1">Total Clients</div>
            <div className="text-foreground text-2xl">{stats.totalClients}</div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-muted-foreground text-sm mb-1">Sessions This Month</div>
            <div className="text-foreground text-2xl">{stats.sessionsThisMonth}</div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-muted-foreground text-sm mb-1">Rating</div>
            <div className="text-foreground text-2xl">{stats.rating}</div>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Revenue Chart */}
          <div className="col-span-2 space-y-6">
            <Card className="p-6 border-border bg-card">
              <h2 className="text-foreground mb-6">Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="month" stroke="#666666" />
                  <YAxis stroke="#666666" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px' }}
                  />
                  <Bar dataKey="revenue" fill="#FF6A00" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Sessions Table */}
            <Card className="border-border bg-card">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-foreground">Upcoming Sessions</h2>
                  <Button size="sm" className="bg-primary text-white">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Availability
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Client</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Date & Time</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingSessions.map((session) => (
                    <TableRow key={session.id} className="border-border">
                      <TableCell className="text-foreground">{session.client}</TableCell>
                      <TableCell className="text-muted-foreground">{session.type}</TableCell>
                      <TableCell className="text-muted-foreground">{session.date} at {session.time}</TableCell>
                      <TableCell>
                        <Badge className={session.paid ? "bg-primary/20 text-primary border-0" : "bg-yellow-500/20 text-yellow-600 border-0"}>
                          {session.paid ? "Paid" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Right Column - Packages & Products */}
          <div className="space-y-6">
            <Card className="p-6 border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground">My Packages</h3>
                <Button 
                  onClick={() => setShowAddPackage(!showAddPackage)}
                  size="sm" 
                  variant="ghost"
                  className="text-primary"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {showAddPackage && (
                <div className="mb-4 p-4 border border-border rounded-lg bg-secondary">
                  <h4 className="text-foreground mb-3 text-sm">Create Package</h4>
                  <div className="space-y-3">
                    <Input placeholder="Package name" className="bg-background border-border h-10 text-sm" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="number" placeholder="Sessions" className="bg-background border-border h-10 text-sm" />
                      <Input type="number" placeholder="Price" className="bg-background border-border h-10 text-sm" />
                    </div>
                    <Button className="w-full bg-primary text-white h-9 text-sm">Create</Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="p-4 border border-border rounded-lg bg-background">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-foreground text-sm">Single Session</h4>
                      <p className="text-muted-foreground text-xs">60 min training</p>
                    </div>
                    <span className="text-primary text-sm">$80</span>
                  </div>
                </div>

                <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-foreground text-sm">Weekly Pack</h4>
                        <Badge className="bg-primary text-white border-0 text-xs h-5">Popular</Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">4 sessions/week</p>
                    </div>
                    <span className="text-primary text-sm">$280</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground">My Products</h3>
                <Button size="sm" variant="ghost" className="text-primary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {myProducts.map((product) => (
                  <div key={product.id} className="p-4 border border-border rounded-lg bg-background">
                    <h4 className="text-foreground text-sm mb-3">{product.name}</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-1">Price</p>
                        <p className="text-primary">${product.price}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Stock</p>
                        <p className="text-foreground">{product.stock}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Sold</p>
                        <p className="text-foreground">{product.sold}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
