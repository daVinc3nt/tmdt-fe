import { useState } from "react";
import { Package, TrendingUp, DollarSign, Truck, Plus, MoreVertical } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MascotLogo } from "./MascotLogo";

const myProducts = [
  { id: 1, name: "Adjustable Dumbbells Set", price: 299.99, stock: 12, sold: 89, category: "Equipment" },
  { id: 2, name: "Performance Tank Top", price: 34.99, stock: 45, sold: 203, category: "Apparel" },
  { id: 3, name: "Compression Shorts", price: 44.99, stock: 28, sold: 92, category: "Apparel" },
  { id: 4, name: "Yoga Mat Premium", price: 59.99, stock: 33, sold: 145, category: "Equipment" }
];

const orders = [
  { id: 1, product: "Adjustable Dumbbells Set", customer: "John D.", status: "pending", amount: 299.99, date: "Nov 14" },
  { id: 2, product: "Performance Tank Top", customer: "Sarah M.", status: "shipped", amount: 34.99, date: "Nov 13" },
  { id: 3, product: "Compression Shorts", customer: "Mike R.", status: "delivered", amount: 44.99, date: "Nov 12" },
  { id: 4, product: "Yoga Mat Premium", customer: "Emma W.", status: "pending", amount: 59.99, date: "Nov 14" }
];

const stats = {
  totalRevenue: 18750,
  activeProducts: 4,
  pendingOrders: 8,
  totalSales: 529
};

export function AgentDashboard() {
  const [showAddProduct, setShowAddProduct] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-500";
      case "shipped": return "bg-blue-500/20 text-blue-500";
      case "delivered": return "bg-primary/20 text-primary";
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
              <h1 className="text-white">Agent Dashboard</h1>
              <p className="text-muted-foreground text-sm">FitGear Agent</p>
            </div>
          </div>
          <Button size="icon" className="rounded-full bg-card">
            <MoreVertical className="w-5 h-5" />
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
                <p className="text-white">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary text-sm">
              <TrendingUp className="w-3 h-3" />
              <span>+15.3%</span>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Products</p>
                <p className="text-white">{stats.activeProducts}</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">Active listings</p>
          </Card>

          <Card className="p-4 bg-card border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Pending</p>
                <p className="text-white">{stats.pendingOrders}</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">Orders to ship</p>
          </Card>

          <Card className="p-4 bg-card border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Sales</p>
                <p className="text-white">{stats.totalSales}</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">All time</p>
          </Card>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-6">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6 bg-card">
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white">Inventory</h2>
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
                <h3 className="text-white mb-4">Add New Product</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="productName">Product Name</Label>
                    <Input id="productName" placeholder="Product name" className="mt-2 h-12 rounded-2xl" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger className="mt-2 h-12 rounded-2xl">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="apparel">Apparel</SelectItem>
                        <SelectItem value="supplements">Supplements</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input id="price" type="number" placeholder="0.00" className="mt-2 h-12 rounded-2xl" />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input id="stock" type="number" placeholder="0" className="mt-2 h-12 rounded-2xl" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Product description..." className="mt-2 rounded-2xl" />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => setShowAddProduct(false)} variant="secondary" className="flex-1 h-12 rounded-2xl">
                      Cancel
                    </Button>
                    <Button className="flex-1 h-12 rounded-2xl bg-primary">
                      Add Product
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {myProducts.map((product) => (
              <Card key={product.id} className="p-4 bg-card border-border rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white mb-1">{product.name}</h3>
                    <p className="text-muted-foreground text-sm">{product.category}</p>
                  </div>
                  <Button size="sm" variant="secondary" className="rounded-xl">
                    Edit
                  </Button>
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

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white">Recent Orders</h2>
              <Select defaultValue="all">
                <SelectTrigger className="w-32 h-10 rounded-xl bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {orders.map((order) => (
              <Card key={order.id} className="p-4 bg-card border-border rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white mb-1">{order.product}</h3>
                    <p className="text-muted-foreground text-sm">Customer: {order.customer}</p>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} border-0 capitalize`}>
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Order Date</p>
                    <p className="text-white text-sm">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-sm mb-1">Amount</p>
                    <p className="text-primary">${order.amount}</p>
                  </div>
                </div>
                {order.status === "pending" && (
                  <Button className="w-full mt-3 h-10 rounded-xl bg-primary">
                    <Truck className="w-4 h-4 mr-2" />
                    Mark as Shipped
                  </Button>
                )}
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
