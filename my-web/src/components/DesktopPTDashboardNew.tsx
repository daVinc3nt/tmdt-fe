import { DollarSign, Calendar, Users, Award, TrendingUp, Plus, MessageSquare, CalendarCheck, Dumbbell } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DesktopPTDashboardNewProps {
  onViewBookings: () => void;
  onViewMessages: () => void;
  onViewGym: () => void;
}

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

export function DesktopPTDashboardNew({ onViewBookings, onViewMessages, onViewGym }: DesktopPTDashboardNewProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground mb-2">PT Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Marcus Steel</p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <Button 
                onClick={onViewGym}
                variant="outline" 
                className="gap-2"
              >
                <Dumbbell className="w-4 h-4" />
                My Gym
              </Button>
              <Button 
                onClick={onViewMessages}
                variant="outline" 
                className="gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Messages
                <Badge className="bg-primary text-white border-0 ml-1">3</Badge>
              </Button>
              <Button 
                onClick={onViewBookings}
                className="bg-primary text-white gap-2"
              >
                <CalendarCheck className="w-4 h-4" />
                View All Bookings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-[12px] flex items-center justify-center">
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
              <div className="w-12 h-12 bg-primary/10 rounded-[12px] flex items-center justify-center">
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
              <div className="w-12 h-12 bg-primary/10 rounded-[12px] flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-muted-foreground text-sm mb-1">Sessions This Month</div>
            <div className="text-foreground text-2xl">{stats.sessionsThisMonth}</div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-[12px] flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-muted-foreground text-sm mb-1">Rating</div>
            <div className="text-foreground text-2xl">{stats.rating}</div>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="col-span-2">
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
                  <Bar dataKey="revenue" fill="#FF7A00" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Right Column - Packages */}
          <div className="space-y-6">
            <Card className="p-6 border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground">My Training Packages</h3>
                <Button size="sm" variant="ghost" className="text-primary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="p-4 border border-border rounded-[12px] bg-background">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-foreground text-sm">Single Session</h4>
                      <p className="text-muted-foreground text-xs">60 min training</p>
                    </div>
                    <span className="text-primary">$80</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-muted-foreground text-xs">24 sessions booked this month</p>
                  </div>
                </div>

                <div className="p-4 border-2 border-primary rounded-[12px] bg-primary/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-foreground text-sm">Weekly Pack</h4>
                        <Badge className="bg-primary text-white border-0 text-xs h-5">Popular</Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">4 sessions/week</p>
                    </div>
                    <span className="text-primary">$280</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-primary/20">
                    <p className="text-muted-foreground text-xs">18 packs sold this month</p>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-[12px] bg-background">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-foreground text-sm">Monthly Pack</h4>
                      <p className="text-muted-foreground text-xs">12 sessions + nutrition plan</p>
                    </div>
                    <span className="text-primary">$850</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-muted-foreground text-xs">8 packs sold this month</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground">Quick Stats</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground text-sm">Package Revenue</span>
                    <span className="text-foreground">$8,940</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[72%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground text-sm">Single Sessions</span>
                    <span className="text-foreground">$1,920</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[15%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground text-sm">Other Income</span>
                    <span className="text-foreground">$1,620</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[13%]" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}