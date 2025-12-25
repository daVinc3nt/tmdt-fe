import { useState, useEffect, useMemo } from "react";
import { Users, DollarSign, AlertCircle, Shield, Trash2, FileSpreadsheet, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { adminService } from "../services/adminService";
import type { User, OrderListResponse } from "../services/adminService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import * as XLSX from 'xlsx';

const ITEMS_PER_PAGE = 10;

export function DesktopAdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<OrderListResponse[]>([]);
  const [revenueStats, setRevenueStats] = useState({ totalRevenue: 0, chartData: [] as Array<{ month: string; revenue: number }> });
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  
  const [usersPage, setUsersPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadRevenueData();
  }, [selectedYear]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, ordersData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllOrders()
      ]);
      setUsers(usersData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRevenueData = async () => {
    try {
      const revenueData = await adminService.getRevenueStats(selectedYear);
      setRevenueStats(revenueData);
      console.log(revenueData);
    } catch (error) {
      console.error("Error loading revenue data:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await adminService.deleteUser(userToDelete);
        setUsers(users.filter(u => u.id !== userToDelete));
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        if (usersPage > 1 && paginatedUsers.length === 1) {
          setUsersPage(usersPage - 1);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: 'PENDING' | 'FINISHED' | 'CANCELLED') => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.order.id === orderId 
          ? { ...order, order: { ...order.order, status: newStatus } }
          : order
      ));
      loadData();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
      case "FINISHED": return "bg-green-500/20 text-green-600 border-green-500/30";
      case "CANCELLED": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getRoleDisplay = (role: string) => {
    if (role === "TRAINER") return "PT";
    if (role === "TRAINEE") return "Trainee";
    if (role === "BUSINESS") return "Agent";
    if (role === "ADMIN") return "Admin";
    return role;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "TRAINER": return "bg-orange-500/20 text-orange-600 border-orange-500/30";
      case "TRAINEE": return "bg-blue-500/20 text-blue-600 border-blue-500/30";
      case "BUSINESS": return "bg-green-500/20 text-green-600 border-green-500/30";
      case "ADMIN": return "bg-purple-500/20 text-purple-600 border-purple-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const activeTrainers = users.filter(u => u.role === "TRAINER").length;
  const platformStats = {
    totalUsers: users.length,
    activeTrainers,
    totalRevenue: revenueStats.totalRevenue,
    pendingDisputes: 0
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return "N/A";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const paginatedUsers = useMemo(() => {
    const start = (usersPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return users.slice(start, end);
  }, [users, usersPage]);

  const paginatedOrders = useMemo(() => {
    const start = (ordersPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return orders.slice(start, end);
  }, [orders, ordersPage]);

  const totalUsersPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const totalOrdersPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

  const exportUsersToExcel = () => {
    const data = users.map(user => ({
      'ID': user.id,
      'Name': user.fullName || 'N/A',
      'Email': user.email,
      'Role': getRoleDisplay(user.role),
      'Phone': user.phoneNumber || 'N/A',
      'Date of Birth': user.dateOfBirth || 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    
    const colWidths = [
      { wch: 8 },
      { wch: 25 },
      { wch: 30 },
      { wch: 12 },
      { wch: 15 },
      { wch: 12 }
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `users_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportOrdersToExcel = () => {
    const data = orders.map(orderItem => {
      const order = orderItem.order;
      return {
        'ID': order.id,
        'Order Date': formatDate(order.orderDate),
        'Total Amount': order.totalPrice || 0,
        'Status': order.status,
        'Payment Method': order.paymentMethod || 'N/A',
        'Shipping Address': order.shippingAddress || 'N/A',
        'Items Count': orderItem.orderItems?.length || 0
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    
    const colWidths = [
      { wch: 8 },
      { wch: 18 },
      { wch: 18 },
      { wch: 15 },
      { wch: 20 },
      { wch: 30 },
      { wch: 12 }
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `orders_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportRevenueToExcel = () => {
    const data = [
      { 'Month': 'Total', 'Revenue (USD)': revenueStats.totalRevenue },
      ...revenueStats.chartData.map(item => ({
        'Month': item.month,
        'Revenue (USD)': item.revenue
      }))
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Revenue');
    
    const colWidths = [
      { wch: 15 },
      { wch: 20 }
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `revenue_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground ml-[52px]">FitConnect Platform Management</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="p-5 lg:p-6 border-border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl lg:text-3xl font-bold text-foreground">{platformStats.totalUsers.toLocaleString()}</p>
            </div>
          </Card>

          <Card className="p-5 lg:p-6 border-border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Personal Trainers</p>
              <p className="text-2xl lg:text-3xl font-bold text-foreground">{platformStats.activeTrainers}</p>
            </div>
          </Card>

          <Card className="p-5 lg:p-6 border-border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl lg:text-3xl font-bold text-foreground">{formatCurrency(platformStats.totalRevenue)}</p>
            </div>
          </Card>

          <Card className="p-5 lg:p-6 border-border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Pending Disputes</p>
              <p className="text-2xl lg:text-3xl font-bold text-foreground">{platformStats.pendingDisputes}</p>
            </div>
          </Card>
        </div>

        <Card className="p-6 lg:p-8 border-border bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-1">Monthly Revenue</h2>
              <p className="text-sm text-muted-foreground">Revenue statistics for {selectedYear}</p>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(Number(value))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = 2025 - i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Button onClick={exportRevenueToExcel} variant="outline" size="sm" className="gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Export Excel
              </Button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={revenueStats.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#FF6A00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any) => {
                  const numValue = typeof value === 'number' ? value : Number(value) || 0;
                  return [formatCurrency(numValue), 'Revenue'];
                }}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#FF6A00" 
                strokeWidth={3}
                fill="url(#colorRevenue)"
                dot={{ fill: '#FF6A00', r: 5, strokeWidth: 2, stroke: 'white' }}
                activeDot={{ r: 8, stroke: '#FF6A00', strokeWidth: 2, fill: '#FF6A00' }}
                name="Revenue (USD)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Tabs defaultValue="users" className="w-full space-y-6">
          <TabsList className="bg-card/50 backdrop-blur-sm border border-border w-full lg:w-auto">
            <TabsTrigger value="users" className="flex-1 lg:flex-none">User Management</TabsTrigger>
            <TabsTrigger value="orders" className="flex-1 lg:flex-none">Order Management</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <div className="p-4 lg:p-6 border-b border-border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">User List</h2>
                    <p className="text-sm text-muted-foreground">Total {users.length} users</p>
                  </div>
                  <Button onClick={exportUsersToExcel} variant="outline" size="sm" className="gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    Export Excel
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-muted/50">
                      <TableHead className="text-muted-foreground font-semibold">Name</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Email</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Role</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Phone</TableHead>
                      <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedUsers.map((user) => (
                        <TableRow key={user.id} className="border-border hover:bg-muted/30 transition-colors">
                          <TableCell className="text-foreground font-medium">{user.fullName || "N/A"}</TableCell>
                          <TableCell className="text-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Badge className={`${getRoleColor(user.role)} border`}>
                              {getRoleDisplay(user.role)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{user.phoneNumber || "N/A"}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setUserToDelete(user.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {totalUsersPages > 1 && (
                <div className="p-4 lg:p-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(usersPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(usersPage * ITEMS_PER_PAGE, users.length)} of {users.length} users
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                      disabled={usersPage === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalUsersPages) }, (_, i) => {
                        let pageNum;
                        if (totalUsersPages <= 5) {
                          pageNum = i + 1;
                        } else if (usersPage <= 3) {
                          pageNum = i + 1;
                        } else if (usersPage >= totalUsersPages - 2) {
                          pageNum = totalUsersPages - 4 + i;
                        } else {
                          pageNum = usersPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={usersPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setUsersPage(pageNum)}
                            className="w-10"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUsersPage(p => Math.min(totalUsersPages, p + 1))}
                      disabled={usersPage === totalUsersPages}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <div className="p-4 lg:p-6 border-b border-border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">Order List</h2>
                    <p className="text-sm text-muted-foreground">Total {orders.length} orders</p>
                  </div>
                  <Button onClick={exportOrdersToExcel} variant="outline" size="sm" className="gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    Export Excel
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-muted/50">
                      <TableHead className="text-muted-foreground font-semibold">ID</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Order Date</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Total Amount</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Shipping Address</TableHead>
                      <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedOrders.map((orderItem) => {
                        const order = orderItem.order;
                        return (
                          <TableRow key={order.id} className="border-border hover:bg-muted/30 transition-colors">
                            <TableCell className="text-foreground font-medium">#{order.id}</TableCell>
                            <TableCell className="text-muted-foreground">{formatDate(order.orderDate)}</TableCell>
                            <TableCell className="text-foreground font-semibold">
                              {formatCurrency(order.totalPrice || 0)}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(order.status)} border capitalize`}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                              {order.shippingAddress || "N/A"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Select
                                value={order.status}
                                onValueChange={(value: 'PENDING' | 'FINISHED' | 'CANCELLED') => 
                                  handleUpdateOrderStatus(order.id, value)
                                }
                              >
                                <SelectTrigger className="w-[140px] h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PENDING">PENDING</SelectItem>
                                  <SelectItem value="FINISHED">FINISHED</SelectItem>
                                  <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
              {totalOrdersPages > 1 && (
                <div className="p-4 lg:p-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(ordersPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(ordersPage * ITEMS_PER_PAGE, orders.length)} of {orders.length} orders
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                      disabled={ordersPage === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalOrdersPages) }, (_, i) => {
                        let pageNum;
                        if (totalOrdersPages <= 5) {
                          pageNum = i + 1;
                        } else if (ordersPage <= 3) {
                          pageNum = i + 1;
                        } else if (ordersPage >= totalOrdersPages - 2) {
                          pageNum = totalOrdersPages - 4 + i;
                        } else {
                          pageNum = ordersPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={ordersPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setOrdersPage(pageNum)}
                            className="w-10"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOrdersPage(p => Math.min(totalOrdersPages, p + 1))}
                      disabled={ordersPage === totalOrdersPages}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
