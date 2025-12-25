import { useState } from "react";
import { ArrowLeft, Star, MapPin, Users, Package, Phone, Mail, Globe, ShoppingCart, Search, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Mock data for gym stores
const gymStoresData: Record<number, any> = {
  1: {
    id: 1,
    name: "PowerFit Gym & Nutrition",
    owner: "Marcus Steel",
    location: "Downtown Los Angeles",
    rating: 4.9,
    reviews: 342,
    totalProducts: 156,
    totalMembers: 2400,
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    logoImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200",
    description: "Premium fitness equipment and supplements. Professional grade products for serious athletes and fitness enthusiasts.",
    phone: "+1 (310) 555-0123",
    email: "contact@powerfit.com",
    website: "www.powerfit.com",
    verified: true,
    products: [
      { id: 1, name: "Premium Whey Protein", category: "supplements", price: 49.99, originalPrice: 69.99, discount: 29, rating: 4.8, reviews: 156, image: "https://images.unsplash.com/photo-1709976142774-ce1ef41a8378?w=400", stock: 24 },
      { id: 2, name: "Adjustable Dumbbells Set", category: "equipment", price: 299.99, originalPrice: 399.99, discount: 25, rating: 4.9, reviews: 89, image: "https://images.unsplash.com/photo-1652492041264-efba848755d6?w=400", stock: 12 },
      { id: 4, name: "Pre-Workout Energy", category: "supplements", price: 39.99, originalPrice: 54.99, discount: 27, rating: 4.6, reviews: 124, image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400", stock: 31 },
      { id: 7, name: "BCAA Recovery", category: "supplements", price: 34.99, rating: 4.7, reviews: 145, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400", stock: 56 }
    ]
  },
  2: {
    id: 2,
    name: "FitGear Pro Shop",
    owner: "FitGear Agent",
    location: "Santa Monica",
    rating: 4.8,
    reviews: 289,
    totalProducts: 203,
    totalMembers: 1850,
    coverImage: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800",
    logoImage: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=200",
    description: "Your one-stop shop for quality gym apparel and accessories. Affordable prices, premium quality.",
    phone: "+1 (310) 555-0456",
    email: "info@fitgearpro.com",
    website: "www.fitgearpro.com",
    verified: true,
    products: [
      { id: 3, name: "Performance Tank Top", category: "apparel", price: 34.99, rating: 4.7, reviews: 203, image: "https://images.unsplash.com/photo-1558151507-c1aa3d917dbb?w=400", stock: 45 },
      { id: 6, name: "Compression Shorts", category: "apparel", price: 44.99, rating: 4.5, reviews: 92, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400", stock: 28 },
      { id: 9, name: "Training Gloves", category: "apparel", price: 29.99, originalPrice: 39.99, discount: 25, rating: 4.6, reviews: 87, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400", stock: 41 }
    ]
  },
  3: {
    id: 3,
    name: "Thunder Fitness Store",
    owner: "Jake Thunder",
    location: "Venice Beach",
    rating: 4.7,
    reviews: 198,
    totalProducts: 124,
    totalMembers: 1520,
    coverImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    logoImage: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200",
    description: "Specialized in resistance training equipment and functional fitness gear.",
    phone: "+1 (424) 555-0789",
    email: "hello@thunderfitness.com",
    website: "www.thunderfitness.com",
    verified: true,
    products: [
      { id: 5, name: "Resistance Bands Set", category: "equipment", price: 24.99, originalPrice: 34.99, discount: 29, rating: 4.8, reviews: 178, image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400", stock: 67 },
      { id: 2, name: "Adjustable Dumbbells Set", category: "equipment", price: 299.99, rating: 4.9, reviews: 89, image: "https://images.unsplash.com/photo-1652492041264-efba848755d6?w=400", stock: 12 }
    ]
  }
};

// 1. CẬP NHẬT INTERFACE PROPS
interface DesktopGymStoreDetailProps {
  gymId: number;
  onBack: () => void;
  onProductClick: (productId: string) => void;
  // 👇 Cập nhật dòng này
  cartItems: any[];
  // 👇 Cập nhật dòng này
  onAddToCart: (product: any, quantity: number, size: string) => void;
}

export function DesktopGymStoreDetail({ gymId, onBack, onProductClick, cartItems, onAddToCart }: DesktopGymStoreDetailProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const gym = gymStoresData[gymId];

  if (!gym) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center border-border bg-card">
          <h2 className="text-foreground mb-4">Gym Store Not Found</h2>
          <Button onClick={onBack} className="bg-primary text-white">
            Back to Stores
          </Button>
        </Card>
      </div>
    );
  }

  const filteredProducts = gym.products.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 2. CẬP NHẬT CÁCH TÍNH TOÁN GIỎ HÀNG (Dùng mảng cartItems)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Hàm check xem item đã có trong giỏ chưa (để đổi text nút bấm)
  const getItemQuantityInCart = (productId: number) => {
    const item = cartItems.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button onClick={onBack} variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Stores
          </Button>
        </div>
      </div>

      {/* Store Header */}
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={gym.coverImage}
          alt={gym.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 pb-6">
            <div className="flex items-end gap-6">
              {/* Logo */}
              <div className="w-32 h-32 rounded-[20px] border-4 border-white overflow-hidden shadow-xl bg-card">
                <ImageWithFallback
                  src={gym.logoImage}
                  alt={`${gym.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-white">{gym.name}</h1>
                  {gym.verified && (
                    <Badge className="bg-green-500 text-white border-0">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-white/90 mb-3">by {gym.owner}</p>
                <div className="flex items-center gap-6 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{gym.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span>{gym.rating} ({gym.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>{gym.totalProducts} Products</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{gym.totalMembers.toLocaleString()} Members</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* About Store */}
            <Card className="p-5 border-border bg-card">
              <h3 className="text-foreground mb-3">About Store</h3>
              <p className="text-muted-foreground text-sm mb-4">{gym.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{gym.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{gym.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4 text-primary" />
                  <span>{gym.website}</span>
                </div>
              </div>
            </Card>

            {/* Search */}
            <Card className="p-5 border-border bg-card">
              <h3 className="text-foreground mb-4">Search Products</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
            </Card>

            {/* Categories */}
            <Card className="p-5 border-border bg-card">
              <h3 className="text-foreground mb-4">Categories</h3>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full" orientation="vertical">
                <TabsList className="w-full flex-col h-auto bg-transparent gap-2">
                  <TabsTrigger value="all" className="w-full justify-start">All Products</TabsTrigger>
                  <TabsTrigger value="supplements" className="w-full justify-start">Supplements</TabsTrigger>
                  <TabsTrigger value="equipment" className="w-full justify-start">Equipment</TabsTrigger>
                  <TabsTrigger value="apparel" className="w-full justify-start">Apparel</TabsTrigger>
                </TabsList>
              </Tabs>
            </Card>

            {/* Cart Summary */}
            {cartCount > 0 && (
              <Card className="p-5 border-primary bg-primary/5 border-2 sticky top-6">
                <h3 className="text-foreground mb-3">Cart Summary</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items:</span>
                    <span className="text-foreground">{cartCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground font-semibold">Total:</span>
                    <span className="text-primary font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full bg-primary text-white pointer-events-none opacity-80">
                  Items in Cart
                </Button>
              </Card>
            )}
          </div>

          {/* Products Grid */}
          <div className="col-span-3">
            <div className="mb-6">
              <p className="text-muted-foreground">{filteredProducts.length} products available</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {filteredProducts.map((product: any) => {
                const qtyInCart = getItemQuantityInCart(product.id);

                return (
                  <Card
                    key={product.id}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border-border bg-card group rounded-[20px] flex flex-col h-full"
                    onClick={() => onProductClick(String(product.id))}
                  >
                    <div className="relative h-56">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.discount && (
                        <Badge className="absolute top-3 left-3 bg-primary text-white border-0 rounded-[8px]">
                          -{product.discount}% OFF
                        </Badge>
                      )}
                      {product.stock < 20 && (
                        <Badge className="absolute top-3 right-3 bg-destructive text-white border-0 rounded-[8px]">
                          Low Stock
                        </Badge>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-foreground mb-1">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3">by {gym.owner}</p>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span className="text-foreground text-sm">{product.rating}</span>
                        </div>
                        <span className="text-muted-foreground text-sm">({product.reviews} reviews)</span>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex flex-col gap-1">
                          {product.originalPrice ? (
                            <>
                              <span className="text-muted-foreground text-sm line-through">${product.originalPrice}</span>
                              <span className="text-primary text-xl">${product.price}</span>
                            </>
                          ) : (
                            <span className="text-primary text-xl">${product.price}</span>
                          )}
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            // 3. GỌI HÀM ADD TO CART MỚI (Thêm 3 tham số)
                            onAddToCart(product, 1, "Standard");
                          }}
                          size="sm"
                          className="bg-primary text-white"
                        >
                          {qtyInCart > 0 ? `In Cart (${qtyInCart})` : "Add to Cart"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <Card className="p-12 text-center border-border bg-card">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-foreground mb-2">No Products Found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}