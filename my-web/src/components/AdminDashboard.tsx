import { Users, DollarSign, AlertCircle, TrendingUp, Shield, Flag } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MascotLogo } from "./MascotLogo";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

const platformStats = {
  totalUsers: 12450,
  activeTrainers: 348,
  totalRevenue: 485620,
  pendingDisputes: 3
};

const recentUsers = [
  { id: 1, name: "Marcus Steel", type: "PT", joined: "Nov 12", status: "active", revenue: 12480 },
  { id: 2, name: "Sarah Power", type: "PT", joined: "Nov 10", status: "active", revenue: 9850 },
  { id: 3, name: "John Davis", type: "Customer", joined: "Nov 14", status: "active", spent: 320 },
  { id: 4, name: "FitGear Co", type: "Agent", joined: "Nov 8", status: "active", revenue: 18750 }
];

const transactions = [
  { id: 1, from: "John D.", to: "Marcus Steel", amount: 80, type: "Session", status: "completed", date: "Nov 14" },
  { id: 2, from: "Sarah M.", to: "FitGear Co", amount: 299.99, type: "Product", status: "completed", date: "Nov 14" },
  { id: 3, from: "Mike R.", to: "Sarah Power", amount: 280, type: "Package", status: "pending", date: "Nov 14" },
  { id: 4, from: "Emma W.", to: "Jake Thunder", amount: 75, type: "Session", status: "completed", date: "Nov 13" }
];

const disputes = [
  { id: 1, reporter: "John D.", against: "Marcus Steel", reason: "Session not delivered", status: "open", date: "Nov 13" },
  { id: 2, reporter: "Mike R.", against: "FitGear Co", reason: "Product quality issue", status: "investigating", date: "Nov 12" },
  { id: 3, reporter: "Emma W.", against: "Sarah Power", reason: "Schedule conflict", status: "resolved", date: "Nov 10" }
];

export function AdminDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-primary/20 text-primary";
      case "pending": return "bg-yellow-500/20 text-yellow-500";
      case "completed": return "bg-primary/20 text-primary";
      case "open": return "bg-destructive/20 text-destructive";
      case "investigating": return "bg-yellow-500/20 text-yellow-500";
      case "resolved": return "bg-primary/20 text-primary";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/20 to-background p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MascotLogo className="w-12 h-12" />
            <div>
              <h1 className="text-white">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm">FitConnect Platform</p>
            </div>
          </div>
          <Button size="icon" className="rounded-full bg-card">
            <Shield className="w-5 h-5 text-primary" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-card border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Users</p>
                <p className="text-white">{platformStats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary text-sm">
              <TrendingUp className="w-3 h-3" />
              <span>+24.5%</span>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Active PTs</p>
                <p className="text-white">{platformStats.activeTrainers}</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">Verified trainers</p>
          </Card>

          <Card className="p-4 bg-card border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Revenue</p>
                <p className="text-white">${platformStats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary text-sm">
              <TrendingUp className="w-3 h-3" />
              <span>+18.2%</span>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-destructive/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Disputes</p>
                <p className="text-white">{platformStats.pendingDisputes}</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">Need attention</p>
          </Card>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-6">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6 bg-card">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white">Recent Users</h2>
              <Button size="sm" className="rounded-xl bg-primary">
                Export Data
              </Button>
            </div>

            <Card className="bg-card border-border rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id} className="border-border">
                      <TableCell>
                        <div>
                          <p className="text-white">{user.name}</p>
                          <p className="text-muted-foreground text-xs">Joined {user.joined}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/20 text-primary border-0">
                          {user.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(user.status)} border-0 capitalize`}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="text-primary">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white">Recent Transactions</h2>
              <Button size="sm" className="rounded-xl bg-primary">
                Export
              </Button>
            </div>

            {transactions.map((tx) => (
              <Card key={tx.id} className="p-4 bg-card border-border rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white">{tx.from}</h3>
                      <span className="text-muted-foreground">→</span>
                      <h3 className="text-white">{tx.to}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{tx.type}</p>
                  </div>
                  <Badge className={`${getStatusColor(tx.status)} border-0 capitalize`}>
                    {tx.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <p className="text-muted-foreground text-sm">{tx.date}</p>
                  <p className="text-primary">${tx.amount}</p>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white">Dispute Resolution</h2>
              <Badge className="bg-destructive/20 text-destructive border-0">
                {disputes.filter(d => d.status !== "resolved").length} Active
              </Badge>
            </div>

            {disputes.map((dispute) => (
              <Card key={dispute.id} className="p-4 bg-card border-border rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-destructive/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Flag className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white mb-1">{dispute.reason}</h3>
                    <p className="text-muted-foreground text-sm">
                      {dispute.reporter} vs {dispute.against}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(dispute.status)} border-0 capitalize`}>
                    {dispute.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <p className="text-muted-foreground text-sm">Reported: {dispute.date}</p>
                  {dispute.status !== "resolved" && (
                    <Button size="sm" className="rounded-xl bg-primary">
                      Review
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
