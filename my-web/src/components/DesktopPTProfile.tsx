import { useState, useEffect } from "react";
import { Star, MapPin, Calendar, Clock, Shield, Award, Users, Heart, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import ptService, { type ReviewAPI, type CreateBookingRequest } from "../services/ptService";

interface DesktopPTProfileProps {
  trainerId?: number | null;
  onBack: () => void;
  onBooking: (data: any) => void;
}

// Hàm fake số liệu bổ sung
const generateStaticStats = (id: number) => {
  const clients = (id * 37) % 450 + 50;
  const basePrice = ((id * 7) % 60) + 40;
  return { clients, basePrice };
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('vi-VN');
  } catch {
    return dateString;
  }
};

export function DesktopPTProfile({ trainerId, onBack, onBooking }: DesktopPTProfileProps) {
  const [selectedPackage, setSelectedPackage] = useState(2);
  const [liked, setLiked] = useState(false);
  const [trainerData, setTrainerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchFullData = async () => {
      if (!trainerId) return;
      setLoading(true);
      try {
        const [apiData, reviewsData] = await Promise.all([
          ptService.getTrainerById(trainerId),
          ptService.getReviewsByTrainerId(trainerId)
        ]);

        if (apiData) {
          let realRating = 0;
          let reviewCount = reviewsData.length;

          if (reviewCount > 0) {
            const totalStars = reviewsData.reduce((sum, r) => sum + r.rating, 0);
            realRating = parseFloat((totalStars / reviewCount).toFixed(1));
          } else {
            realRating = 5.0;
          }

          const stats = generateStaticStats(apiData.id);
          let realCerts: string[] = apiData.certificate
            ? (apiData.certificate.includes(',') ? apiData.certificate.split(',').map((c: any) => c.trim()) : [apiData.certificate])
            : ["Chưa cập nhật chứng chỉ"];

          setTrainerData({
            ...apiData,
            clients: stats.clients,
            rating: realRating,
            reviewCount: reviewCount,
            reviewsList: reviewsData,
            price: stats.basePrice,
            location: ["Quận 1, TP.HCM", "Cầu Giấy, Hà Nội", "Hải Châu, Đà Nẵng"][apiData.id % 3],
            certifications: realCerts,
            packages: [
              { id: 1, name: "Buổi Lẻ", price: stats.basePrice, duration: "60 phút", sessions: 1, description: "Thử tập một buổi để trải nghiệm." },
              { id: 2, name: "Gói Tuần", price: stats.basePrice * 4 * 0.9, duration: "60 phút", sessions: 4, popular: true, description: "Tập 4 buổi/tuần (Giảm 10%)." },
              { id: 3, name: "Gói Tháng", price: stats.basePrice * 16 * 0.8, duration: "60 phút", sessions: 16, description: "Cam kết 1 tháng (Giảm 20%)." }
            ]
          });
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFullData();
  }, [trainerId]);

  // --- HÀM XỬ LÝ GỌI API POST BOOKING ---
  const handleBookingSubmit = async () => {
    if (!trainerId || !trainerData) return;
    const pkg = trainerData.packages.find((p: any) => p.id === selectedPackage);
    if (!pkg) return;

    onBooking({
      trainerId: trainerData.id,
      trainerName: trainerData.name,
      packageId: pkg.id,
      price: pkg.price
    });
  };
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!trainerData) return <div className="p-10 text-center text-foreground">Không tìm thấy thông tin huấn luyện viên.</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button onClick={onBack} variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Thông tin Profile */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card overflow-hidden shadow-sm">
              <div className="relative h-80">
                <ImageWithFallback src={trainerData.avatar} alt={trainerData.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <Button onClick={() => setLiked(!liked)} size="icon" className="absolute top-4 right-4 rounded-full bg-white/90 hover:bg-white text-black">
                  <Heart className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h1 className="text-4xl font-bold mb-1">{trainerData.name}</h1>
                  <div className="flex items-center gap-3">
                    <p className="text-lg opacity-90">{trainerData.specialization}</p>
                    <Badge className="bg-primary text-white border-0"><Shield className="w-3 h-3 mr-1" /> Verified</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 p-6 border-t border-border">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1 text-primary"><Star className="w-5 h-5 fill-current" /><span className="text-foreground text-xl font-bold">{trainerData.rating}</span></div>
                  <p className="text-muted-foreground text-sm">{trainerData.reviewCount} Đánh giá</p>
                </div>
                <div className="text-center border-l border-border">
                  <div className="flex items-center justify-center gap-1 mb-1 text-primary"><Users className="w-5 h-5" /><span className="text-foreground text-xl font-bold">{trainerData.clients}</span></div>
                  <p className="text-muted-foreground text-sm">Học viên</p>
                </div>
                <div className="text-center border-l border-border">
                  <div className="flex items-center justify-center gap-1 mb-1 text-primary"><Award className="w-5 h-5" /><span className="text-foreground text-xl font-bold">{trainerData.experience} Năm</span></div>
                  <p className="text-muted-foreground text-sm">Kinh nghiệm</p>
                </div>
                <div className="text-center border-l border-border flex flex-col justify-center items-center">
                  <MapPin className="w-5 h-5 text-primary mb-1" />
                  <p className="text-muted-foreground text-xs line-clamp-1">{trainerData.location}</p>
                </div>
              </div>
            </Card>

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full bg-card border border-border h-12">
                <TabsTrigger value="about" className="flex-1">Giới thiệu</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">Đánh giá ({trainerData.reviewCount})</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="space-y-6 mt-6">
                <Card className="p-6 border-border bg-card">
                  <h3 className="text-foreground font-bold mb-3 text-lg">Tiểu sử</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{trainerData.bio}</p>
                </Card>
              </TabsContent>
              <TabsContent value="reviews" className="space-y-4 mt-6">
                {trainerData.reviewsList?.length > 0 ? (
                  trainerData.reviewsList.map((review: ReviewAPI) => (
                    <Card key={review.id} className="p-6 border-border bg-card shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-border flex-shrink-0">
                          <ImageWithFallback src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.user.fullName || "User")}&background=random`} alt={review.user.fullName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-foreground">{review.user.fullName}</h4>
                            <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />))}</div>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">{review.comment}</p>
                          <p className="text-xs text-muted-foreground/70">{formatDate(review.reviewDate)}</p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-dashed">Chưa có đánh giá nào.</div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Cột phải: Chọn gói tập */}
          <div className="space-y-6">
            <Card className="p-6 border-border bg-card sticky top-24 shadow-md">
              <h3 className="text-foreground font-bold mb-4 text-xl">Chọn gói tập</h3>
              <div className="space-y-3 mb-6">
                {trainerData.packages.map((pkg: any) => (
                  <div key={pkg.id} onClick={() => setSelectedPackage(pkg.id)} className={`p-4 rounded-xl cursor-pointer transition-all border-2 relative ${selectedPackage === pkg.id ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-background hover:border-primary/30"}`}>
                    {pkg.popular && <Badge className="absolute -top-2.5 right-4 bg-primary text-white text-[10px] uppercase font-bold">Phổ biến</Badge>}
                    <div className="flex justify-between items-center mb-1"><h4 className="font-bold text-foreground">{pkg.name}</h4><span className="font-bold text-primary text-xl">${pkg.price.toFixed(0)}</span></div>
                    <p className="text-xs text-muted-foreground mb-3">{pkg.description}</p>
                    <div className="flex gap-4 text-xs font-medium text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {pkg.sessions} buổi</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 60 phút</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleBookingSubmit} disabled={isBooking} className="w-full h-14 text-lg font-bold shadow-lg">
                {isBooking ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang xử lý...</> : `Đặt ngay ($${trainerData.packages.find((p: any) => p.id === selectedPackage)?.price.toFixed(0)})`}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}