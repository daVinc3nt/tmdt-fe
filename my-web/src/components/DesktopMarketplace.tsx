import { useState, useEffect } from "react";
import { Search, Star, ArrowLeft, Loader2 } from "lucide-react"; // Thêm icon Loader2
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
// 1. IMPORT SERVICE
import productService, { type Product as ApiProduct } from "../services/productService";
// 2. ĐỊNH NGHĨA KIỂU DỮ LIỆU CHO UI (Mở rộng từ API Product)
// Vì UI cần nhiều trường hơn Backend trả về, ta tạo type này để TypeScript không báo lỗi
interface UIProduct extends Omit<ApiProduct, 'category'> {
  category?: string;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  seller?: string;
  stock?: number;
}

interface DesktopMarketplaceProps {
  onBack: () => void;
  onProductClick: (productId: string) => void;
  cartItems: any[];
  onAddToCart: (product: any, quantity: number, size: string) => void;
}

export function DesktopMarketplace({ onBack, onProductClick, cartItems, onAddToCart }: DesktopMarketplaceProps) {
  // 3. STATE QUẢN LÝ DỮ LIỆU API
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 4. GỌI API KHI COMPONENT MOUNT
  // import ...
  // import productService, { Product } from "../services/productService";

  // ... bên trong useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // 1. Gọi API
        // Lưu ý: response ở đây có thể là mảng Product[] hoặc AxiosResponse<Product[]>
        // tùy thuộc vào file axiosClient.ts của bạn.
        const response = await productService.getAllProducts();

        console.log("🔥 Raw Response:", response); // Log ra để check cấu trúc

        // 2. Lấy data thật
        // Dòng này tự động check: nếu response là mảng thì dùng luôn, nếu là object bọc thì lấy .data
        const productsData = Array.isArray(response) ? response : (response as any).data;

        // Check lại lần cuối cho chắc
        if (!Array.isArray(productsData)) {
          console.error("Dữ liệu nhận được không phải là mảng:", productsData);
          setProducts([]);
          return;
        }

        // 3. Mapping data (Vì UI cần field 'rating', 'reviews' mà Backend chưa có)
        const mappedProducts = productsData.map((p: any) => ({
          ...p,
          // Giữ nguyên các field backend trả về
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image || "https://via.placeholder.com/300", // Fallback nếu ảnh null
          category: p.category,
          stock: p.stockQuantity, // Map 'stockQuantity' của backend sang 'stock' của UI

          // Fake thêm dữ liệu UI cần để demo đẹp (sau này Backend có thì xóa đi)
          rating: 4.5,
          reviews: 10,
          seller: "Official Store",
          discount: 0,
          originalPrice: p.price
        }));

        setProducts(mappedProducts);

      } catch (error) {
        console.error("❌ Lỗi gọi API:", error);
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter Logic (Vẫn giữ nguyên chạy ở Client-side cho mượt)
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getItemQuantityInCart = (productId: number) => {
    const item = cartItems.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button onClick={onBack} variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-foreground text-xl font-bold">Marketplace</h1>
            <div className="w-[120px]"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 5. XỬ LÝ TRẠNG THÁI LOADING / ERROR */}
        {loading ? (
          <div className="flex h-[400px] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-[400px] w-full items-center justify-center">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </div>
        ) : (
          /* Giao diện chính khi đã có dữ liệu */
          <div className="grid grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="space-y-6">
              <Card className="p-5 border-border bg-card">
                <h3 className="text-foreground mb-4">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>
              </Card>

              <Card className="p-5 border-border bg-card">
                <h3 className="text-foreground mb-4">Categories</h3>
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full" orientation="vertical">
                  <TabsList className="w-full flex-col h-auto bg-transparent gap-2">
                    <TabsTrigger value="all" className="w-full justify-start">All Products</TabsTrigger>
                    {/* Các category này nên khớp với dữ liệu backend trả về hoặc logic map */}
                    <TabsTrigger value="supplements" className="w-full justify-start">Supplements</TabsTrigger>
                    <TabsTrigger value="equipment" className="w-full justify-start">Equipment</TabsTrigger>
                    <TabsTrigger value="apparel" className="w-full justify-start">Apparel</TabsTrigger>
                  </TabsList>
                </Tabs>
              </Card>

              <Card className="p-5 border-border bg-card">
                <h3 className="text-foreground mb-4">Sort By</h3>
                <Select defaultValue="popular">
                  <SelectTrigger className="w-full bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </Card>

              {cartCount > 0 && (
                <Card className="p-5 border-primary bg-primary/5 border-2 sticky top-6">
                  <h3 className="text-foreground mb-3 font-bold">Cart Summary</h3>
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
                <p className="text-muted-foreground">{filteredProducts.length} products found</p>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const qtyInCart = getItemQuantityInCart(product.id);

                    return (
                      <Card
                        key={product.id}
                        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border-border bg-card group flex flex-col h-full"
                        onClick={() => onProductClick(String(product.id))}
                      >
                        <div className="relative h-56">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.discount && (
                            <Badge className="absolute top-3 left-3 bg-primary text-white border-0">
                              -{product.discount}% OFF
                            </Badge>
                          )}
                          {product.stock && product.stock < 20 && (
                            <Badge className="absolute top-3 right-3 bg-destructive text-white border-0">
                              Low Stock
                            </Badge>
                          )}
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-foreground mb-1 font-semibold line-clamp-1">{product.name}</h3>
                          <p className="text-muted-foreground text-sm mb-3">by {product.seller}</p>

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
                                  <span className="text-muted-foreground text-sm line-through">${product.originalPrice.toFixed(2)}</span>
                                  <span className="text-primary text-xl font-bold">${product.price.toFixed(2)}</span>
                                </>
                              ) : (
                                <span className="text-primary text-xl font-bold">${product.price.toFixed(2)}</span>
                              )}
                            </div>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
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
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No products found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}