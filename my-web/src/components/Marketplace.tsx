import { useState } from "react";
import { ArrowLeft, Search, ShoppingCart, Star, Plus, Minus } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const products = [
  {
    id: 1,
    name: "Premium Whey Protein",
    category: "supplements",
    price: 49.99,
    rating: 4.8,
    reviews: 156,
    seller: "Marcus Steel",
    image: "https://images.unsplash.com/photo-1709976142774-ce1ef41a8378?w=400",
    stock: 24
  },
  {
    id: 2,
    name: "Adjustable Dumbbells Set",
    category: "equipment",
    price: 299.99,
    rating: 4.9,
    reviews: 89,
    seller: "FitGear Agent",
    image: "https://images.unsplash.com/photo-1652492041264-efba848755d6?w=400",
    stock: 12
  },
  {
    id: 3,
    name: "Performance Tank Top",
    category: "apparel",
    price: 34.99,
    rating: 4.7,
    reviews: 203,
    seller: "FitGear Agent",
    image: "https://images.unsplash.com/photo-1558151507-c1aa3d917dbb?w=400",
    stock: 45
  },
  {
    id: 4,
    name: "Pre-Workout Energy",
    category: "supplements",
    price: 39.99,
    rating: 4.6,
    reviews: 124,
    seller: "Sarah Power",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400",
    stock: 31
  },
  {
    id: 5,
    name: "Resistance Bands Set",
    category: "equipment",
    price: 24.99,
    rating: 4.8,
    reviews: 178,
    seller: "Jake Thunder",
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400",
    stock: 67
  },
  {
    id: 6,
    name: "Compression Shorts",
    category: "apparel",
    price: 44.99,
    rating: 4.5,
    reviews: 92,
    seller: "FitGear Agent",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400",
    stock: 28
  }
];

interface MarketplaceProps {
  onBack: () => void;
}

export function Marketplace({ onBack }: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find(p => p.id === Number(id));
    return sum + (product?.price || 0) * qty;
  }, 0);

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={onBack} size="icon" variant="ghost">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white flex-1">Marketplace</h1>
          <div className="relative">
            <Button size="icon" className="rounded-full bg-primary">
              <ShoppingCart className="w-5 h-5" />
            </Button>
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white border-0 p-0 flex items-center justify-center text-xs">
                {cartCount}
              </Badge>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-background rounded-2xl"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 py-4">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-card">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="supplements">Supplements</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="apparel">Apparel</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Products Grid */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-0 bg-card border-border rounded-2xl overflow-hidden">
              <div className="relative">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                {product.stock < 20 && (
                  <Badge className="absolute top-2 right-2 bg-destructive text-white border-0 text-xs">
                    Low Stock
                  </Badge>
                )}
              </div>

              <div className="p-3">
                <h3 className="text-white text-sm mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-muted-foreground text-xs mb-2">{product.seller}</p>

                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="text-white text-xs">{product.rating}</span>
                  <span className="text-muted-foreground text-xs">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-primary">${product.price}</span>
                  {cart[product.id] ? (
                    <div className="flex items-center gap-2 bg-primary/20 rounded-full px-2 py-1">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3 text-white" />
                      </button>
                      <span className="text-white text-sm min-w-[16px] text-center">{cart[product.id]}</span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => addToCart(product.id)}
                      size="sm"
                      className="h-7 rounded-full bg-primary text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-card border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-muted-foreground text-sm">{cartCount} items</p>
              <p className="text-white">Total: ${cartTotal.toFixed(2)}</p>
            </div>
            <Button className="h-12 px-8 rounded-2xl bg-primary">
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
