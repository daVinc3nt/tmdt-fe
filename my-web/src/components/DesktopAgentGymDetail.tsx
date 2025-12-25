import { useState } from "react";
import { ArrowLeft, Plus, Edit, Trash2, Package, DollarSign, TrendingUp, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  image: string;
  status: "active" | "out-of-stock";
}

interface DesktopAgentGymDetailProps {
  gymId: number;
  onBack: () => void;
  onAddProduct: () => void;
}

export function DesktopAgentGymDetail({ gymId, onBack, onAddProduct }: DesktopAgentGymDetailProps) {
  // Mock gym data
  const gym = {
    id: gymId,
    name: "PowerFit Training Center",
    location: "New York, NY",
    description: "Premium strength training and bodybuilding facility",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800"
  };

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Premium Protein Powder",
      category: "Supplements",
      price: 49.99,
      stock: 150,
      sold: 89,
      image: "https://images.unsplash.com/photo-1579722821273-0f6c7d6d6f8f?w=400",
      status: "active"
    },
    {
      id: 2,
      name: "Resistance Bands Set",
      category: "Equipment",
      price: 29.99,
      stock: 75,
      sold: 45,
      image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400",
      status: "active"
    },
    {
      id: 3,
      name: "Gym Gloves Pro",
      category: "Accessories",
      price: 24.99,
      stock: 0,
      sold: 120,
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
      status: "out-of-stock"
    },
    {
      id: 4,
      name: "Water Bottle 1L",
      category: "Accessories",
      price: 15.99,
      stock: 200,
      sold: 156,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
      status: "active"
    }
  ]);

  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sold), 0);
  const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
  const activeProducts = products.filter(p => p.status === "active").length;

  const handleDeleteProduct = (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Gym Info */}
      <div className="bg-gradient-to-r from-primary/5 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <div className="grid grid-cols-[300px_1fr] gap-6">
            <div className="rounded-[20px] overflow-hidden h-48">
              <ImageWithFallback
                src={gym.image}
                alt={gym.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-foreground mb-2">{gym.name}</h1>
              <p className="text-muted-foreground mb-4">{gym.location}</p>
              <p className="text-muted-foreground text-sm mb-6">{gym.description}</p>

              <div className="flex gap-6">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Total Revenue</p>
                  <p className="text-foreground text-xl">${totalRevenue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Products Sold</p>
                  <p className="text-foreground text-xl">{totalSold}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Active Products</p>
                  <p className="text-foreground text-xl">{activeProducts}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-border bg-card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-[12px] bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-foreground mb-1">${totalRevenue.toFixed(0)}</h3>
            <p className="text-muted-foreground text-sm mb-2">Total Revenue</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm">+15.3%</span>
            </div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-[12px] bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-foreground mb-1">{products.length}</h3>
            <p className="text-muted-foreground text-sm mb-2">Total Products</p>
            <div className="flex items-center gap-1">
              <span className="text-primary text-sm">{activeProducts} active</span>
            </div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-[12px] bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-foreground mb-1">{totalSold}</h3>
            <p className="text-muted-foreground text-sm mb-2">Units Sold</p>
            <div className="flex items-center gap-1">
              <span className="text-primary text-sm">All time</span>
            </div>
          </Card>
        </div>

        {/* Products Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-foreground">My Products</h2>
            <Button 
              onClick={onAddProduct}
              className="bg-primary text-white gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </Button>
          </div>

          {products.length === 0 ? (
            <Card className="p-12 text-center border-border bg-card">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-foreground mb-2">No Products Yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your first product to start selling on the marketplace
              </p>
              <Button 
                onClick={onAddProduct}
                className="bg-primary text-white gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Product
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id} className="p-6 border-border bg-card">
                  <div className="grid grid-cols-[120px_1fr_auto] gap-6 items-center">
                    {/* Product Image */}
                    <div className="rounded-[12px] overflow-hidden h-28">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-foreground mb-1">{product.name}</h3>
                          <p className="text-muted-foreground text-sm">{product.category}</p>
                        </div>
                        {product.status === "out-of-stock" && (
                          <span className="px-3 py-1 bg-red-500/10 text-red-500 text-xs rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-6 mt-4">
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Price</p>
                          <p className="text-primary text-lg">${product.price}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Stock</p>
                          <p className="text-foreground text-lg">{product.stock}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Sold</p>
                          <p className="text-foreground text-lg">{product.sold}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
