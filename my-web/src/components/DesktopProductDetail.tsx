import { 
  ArrowLeft, 
  ShoppingCart, 
  Star, 
  Check, 
  Loader2, 
  AlertCircle 
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";
import productService, { type Product } from "../services/productService";

interface DesktopProductDetailProps {
  productId: string;
  onBack: () => void;
  onAddToCart: (product: any, quantity: number, size: string) => void;
}

export function DesktopProductDetail({ productId, onBack, onAddToCart }: DesktopProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Free Size");

  // Fetch dữ liệu từ API khi component mount hoặc productId thay đổi
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Gọi API GET /products/{id}
        const response = await productService.getProductById(Number(productId));
        
        // Lưu ý: Nếu axiosClient của bạn đã trả về response.data trong interceptor 
        // thì gán trực tiếp, nếu chưa thì dùng response.data
        const data = (response as any).data || response;
        
        setProduct(data);
        
        // Reset trạng thái chọn khi đổi sản phẩm
        setQuantity(1);
        // Nếu backend sau này có mảng sizes, hãy cập nhật dòng này
        setSelectedSize("Free Size"); 
        
      } catch (err: any) {
        console.error("Fetch Product Error:", err);
        setError("Không thể tải thông tin sản phẩm. Vui lòng kiểm tra lại kết nối hoặc ID sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // 1. Trạng thái Đang tải
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  // 2. Trạng thái Lỗi hoặc Không tìm thấy sản phẩm
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-foreground">{error || "Sản phẩm không tồn tại"}</h2>
        <Button onClick={onBack} variant="default">
          Quay lại Marketplace
        </Button>
      </div>
    );
  }

  // Logic kiểm tra tồn kho từ Backend
  const inStock = product.stockQuantity > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Điều hướng */}
      <div className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* CỘT TRÁI: HÌNH ẢNH (Mapping trường image từ API) */}
          <div className="space-y-4">
            <Card className="rounded-[20px] overflow-hidden bg-secondary border-border shadow-sm">
              <ImageWithFallback 
                src={product.image} 
                alt={product.name} 
                className="w-full h-[550px] object-contain p-4" 
              />
            </Card>
          </div>

          {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-primary text-white">Sản phẩm chính hãng</Badge>
                {inStock ? (
                  <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">
                    <Check className="w-3 h-3 mr-1" /> Còn hàng ({product.stockQuantity})
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-red-500 text-red-600 bg-red-50">
                    Hết hàng
                  </Badge>
                )}
              </div>
              
              <h1 className="text-foreground mb-4 text-4xl font-extrabold tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                  <span className="text-foreground ml-2 font-bold text-lg">5.0</span>
                </div>
                <span className="text-muted-foreground border-l pl-4">Đã bán: {Math.floor(Math.random() * 100)}+</span>
              </div>

              <div className="mb-6 p-4 bg-secondary/30 rounded-xl">
                <span className="text-primary text-4xl font-black">
                  {product.price.toLocaleString()}đ
                </span>
              </div>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Lựa chọn số lượng */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-foreground font-bold text-lg">Số lượng mua</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg bg-white overflow-hidden">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-none hover:bg-secondary"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    disabled={!inStock}
                  > - </Button>
                  <span className="text-foreground w-14 text-center font-bold">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-none hover:bg-secondary"
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))} 
                    disabled={!inStock}
                  > + </Button>
                </div>
                <span className="text-sm text-muted-foreground italic">
                  Tối đa: {product.stockQuantity} sản phẩm
                </span>
              </div>
            </div>

            {/* Hành động */}
            <div className="flex gap-4 pt-4">
              <Button
                className="flex-[2] bg-primary hover:bg-primary/90 text-white gap-3 h-14 text-xl font-bold rounded-xl shadow-lg shadow-primary/20"
                onClick={() => onAddToCart(product, quantity, selectedSize)}
                disabled={!inStock}
              >
                <ShoppingCart className="w-6 h-6" /> Thêm vào giỏ
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 h-14 text-xl font-bold rounded-xl border-2"
                disabled={!inStock}
              >
                Mua ngay
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs thông tin bổ sung */}
        <div className="mt-16">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-8">
              <TabsTrigger 
                value="overview" 
                className="rounded-none data-[state=active]:border-b-4 data-[state=active]:border-primary px-2 py-4 text-lg font-bold bg-transparent shadow-none"
              >
                Mô tả sản phẩm
              </TabsTrigger>
              <TabsTrigger 
                value="details" 
                className="rounded-none data-[state=active]:border-b-4 data-[state=active]:border-primary px-2 py-4 text-lg font-bold bg-transparent shadow-none"
              >
                Thông số kỹ thuật
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-8">
                <Card className="p-8 border-border rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Chi tiết về {product.name}</h3>
                    <p className="text-muted-foreground leading-loose whitespace-pre-line">
                      {product.description}
                    </p>
                </Card>
            </TabsContent>
            
            <TabsContent value="details" className="mt-8">
                <Card className="p-8 border-border rounded-2xl shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        <div className="flex justify-between border-b py-3">
                            <span className="text-muted-foreground font-medium">Danh mục</span>
                            <span className="font-bold text-primary">{product.category}</span>
                        </div>
                        <div className="flex justify-between border-b py-3">
                            <span className="text-muted-foreground font-medium">Mã sản phẩm</span>
                            <span className="font-bold">#PROD-{product.id}</span>
                        </div>
                        <div className="flex justify-between border-b py-3">
                            <span className="text-muted-foreground font-medium">Trạng thái</span>
                            <span className="font-bold text-green-600">Kiểm định an toàn</span>
                        </div>
                        <div className="flex justify-between border-b py-3">
                            <span className="text-muted-foreground font-medium">Vận chuyển</span>
                            <span className="font-bold">Toàn quốc</span>
                        </div>
                    </div>
                </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}