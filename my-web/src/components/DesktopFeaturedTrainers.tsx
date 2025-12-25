import { useState, useEffect } from "react";
// 1. FIX LỖI IMPORT: Thêm chữ 'type' vào trước Product
import productService, { type Product } from "../services/productService";
import ptService, { type Trainer } from "../services/ptService";

import { TrendingUp, Users, Star, Heart, MapPin, Dumbbell, Filter, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// 2. FIX LỖI XUẤT KHẨU (EXPORT):
// Giữ lại dòng này để tránh crash các file khác đang import nó (như Profile)
export const allTrainers: any[] = [];

// 3. FIX LỖI INTERFACE: Thêm image?: string
interface UITrainer extends Trainer {
  gym: string;
  gymLogo: string;
  price: number;
  location: string;
  reviews: number;
  featured: boolean;
  favorite: boolean;
  image?: string; // 👈 Thêm dòng này để hết lỗi đỏ ở dòng 297
}

interface DesktopFeaturedTrainersProps {
  onTrainerClick: (trainerId: number) => void;
  onViewGyms: () => void;
  onShopProducts: () => void;
  onRefundPolicyClick?: () => void;
  onProductClick?: (productId: number) => void;
}

export function DesktopFeaturedTrainers({
  onTrainerClick,
  onViewGyms,
  onShopProducts,
  onRefundPolicyClick,
  onProductClick
}: DesktopFeaturedTrainersProps) {
  const [trainers, setTrainers] = useState<UITrainer[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("highest");
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Gọi API
        const [ptData, productResponse] = await Promise.all([
          ptService.getAllTrainers(),
          productService.getAllProducts()
        ]);

        // Map dữ liệu Trainer
        const mappedTrainers: UITrainer[] = ptData.map((pt) => ({
          ...pt,
          gym: "FitConnect Center",
          gymLogo: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200",
          price: Math.floor(Math.random() * (100 - 50) + 50),
          location: ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng"][Math.floor(Math.random() * 3)],
          reviews: Math.floor(Math.random() * 300),
          featured: Math.random() > 0.7,
          favorite: false,
          image: pt.avatar // Gán avatar từ API vào field image của UI
        }));
        setTrainers(mappedTrainers);

        // Map dữ liệu Product
        const rawProducts = Array.isArray(productResponse) ? productResponse : (productResponse as any).data || [];
        setProducts(rawProducts.slice(0, 4));

      } catch (error) {
        console.error("❌ Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    { id: "top", label: "Top Trainers" },
    { id: "all", label: "All Trainers" },
    { id: "Strength", label: "Strength" },
    { id: "CrossFit", label: "CrossFit" },
    { id: "Yoga", label: "Yoga" },
    { id: "Boxing", label: "Boxing" },
    { id: "Bodybuilding", label: "Bodybuilding" }
  ];

  const filteredTrainers = trainers.filter(trainer => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "top") return trainer.featured;
    return trainer.specialization?.toLowerCase().includes(selectedCategory.toLowerCase());
  }).sort((a, b) => {
    if (sortBy === "highest") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "lowest") return (a.rating || 0) - (b.rating || 0);
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  const toggleFavorite = (trainerId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(trainerId)
        ? prev.filter(id => id !== trainerId)
        : [...prev, trainerId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-background to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-foreground mb-4">Connect with Elite Trainers</h1>
              <p className="text-muted-foreground text-lg mb-8">
                Connect with elite personal trainers and access premium gym equipment. Start your transformation today.
              </p>

              <div className="flex gap-4 mb-12">
                <Button className="bg-primary text-white gap-2" size="lg" onClick={onViewGyms}>
                  <Dumbbell className="w-5 h-5" />
                  Find a Trainer
                </Button>
                <Button variant="outline" size="lg" onClick={onShopProducts}>
                  Shop Products
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary text-3xl">{trainers.length}+</span>
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">Active Trainers</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary text-3xl">12K+</span>
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">Happy Clients</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary text-3xl">4.9</span>
                    <Star className="w-5 h-5 fill-primary text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">Average Rating</p>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] rounded-[20px] overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
                alt="Fitness training banner showing trainer and equipment"
                fetchPriority="high"
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Sản phẩm nổi bật</h2>
          </div>
          <Button variant="ghost" onClick={onShopProducts} className="text-primary gap-1" aria-label="Xem tất cả sản phẩm">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} onClick={() => onProductClick && onProductClick(product.id)} className="cursor-pointer group">
                <Card className="overflow-hidden border-border bg-card hover:shadow-lg transition-all h-full">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <ImageWithFallback
                      src={product.image || "https://via.placeholder.com/300"}
                      alt={`Hình ảnh sản phẩm ${product.name}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">Hot</Badge>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{product.category || "General"}</p>
                    <h3 className="font-semibold truncate mb-2 text-foreground">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{parseInt(product.price).toLocaleString()}đ</span>
                      <Button size="sm" variant="secondary" className="hover:bg-primary hover:text-white transition-colors">Mua ngay</Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Chưa có sản phẩm nào.</p>
        )}
      </div>

      {/* Trainers Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id ? "bg-primary text-white" : ""}
                aria-label={`Filter by category ${cat.label}`}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-card border-border" aria-label="Sort trainers">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" aria-label="Show filter options">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-lg">Danh sách Huấn Luyện Viên</span>
          <span className="text-muted-foreground ml-2">({filteredTrainers.length} available)</span>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {filteredTrainers.map((trainer) => (
            <div
              key={trainer.id}
              onClick={() => onTrainerClick(trainer.id)}
              className="cursor-pointer"
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border bg-card group h-full">
                <div className="relative h-72">
                  <ImageWithFallback
                    src={trainer.image || trainer.avatar} // Sử dụng cả 2 cho chắc ăn
                    alt={trainer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <button
                    onClick={(e) => toggleFavorite(trainer.id, e)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors shadow-lg"
                  >
                    <Heart
                      className={`w-5 h-5 ${favorites.includes(trainer.id) || trainer.favorite
                        ? "fill-white text-white"
                        : "text-white"
                        }`}
                    />
                  </button>

                  <div className="absolute top-3 left-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-lg bg-card">
                      <ImageWithFallback
                        src={trainer.gymLogo}
                        alt={trainer.gym}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-foreground mb-1">{trainer.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{trainer.specialization}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-foreground text-sm">{trainer.rating}</span>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      • {trainer.experience} năm KN
                    </div>
                    <span className="text-muted-foreground text-sm">({trainer.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">{trainer.location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-primary text-xl">${trainer.price}</span>
                      <span className="text-muted-foreground text-sm">/session</span>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTrainerClick(trainer.id);
                      }}
                      size="sm"
                      className="bg-primary text-white"
                    >
                      Book
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {filteredTrainers.length === 0 && !loading && (
          <Card className="p-12 text-center border-border bg-card">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-foreground mb-2">No Trainers Found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </Card>
        )}
      </div>
    </div>
  );
}