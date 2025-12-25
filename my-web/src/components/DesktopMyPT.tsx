import { useState, useEffect } from "react";
import { ArrowLeft, Star, Calendar, MessageCircle, Heart, MapPin, Trophy, Clock, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { RatePTModal } from "./RatePTModal";
import { ChatWithPTModal } from "./ChatWithPTModal";
import { useAuth } from "../context/AuthContext";

// Import Service và Interface
import ptService, { type BookingAPI, type UserAPI } from "../services/ptService";

// Helper function để decode JWT và lấy userId
const getUserIdFromToken = (token: string | null): number | null => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.userId || null;
  } catch (error) {
    console.error("Lỗi decode JWT:", error);
    return null;
  }
};

interface DesktopMyPTProps {
  onBack: () => void;
  onTrainerSelect: (id: number) => void;
  onBookSession: (trainerId: number) => void;
}

interface MyTrainerUI {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  sessionsCompleted: number;
  nextSession: string; 
  statusNext: string; 
  isFavorite: boolean;
  lastBooked: string;
  rawNextSessionDate?: Date;
}

export function DesktopMyPT({ onBack, onTrainerSelect, onBookSession }: DesktopMyPTProps) {
  const { token } = useAuth();
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  
  const [myTrainers, setMyTrainers] = useState<MyTrainerUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalSessions: 0, upcomingSessions: 0, favoritePTs: 0, hoursTrained: 0 });

  // Format thời gian đặt gần nhất
  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      const now = new Date();
      const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) return "Gần đây";
      return `${diffDays} ngày trước`;
    } catch { return "N/A"; }
  };

  // Format ngày tập tiếp theo
  const formatNextSession = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Chưa xác định";
      return date.toLocaleDateString('vi-VN') + " lúc " + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch { return "Chưa xác định"; }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Lấy traineeId từ JWT token
        const traineeId = getUserIdFromToken(token);
        if (!traineeId) {
          console.error("Không thể lấy traineeId từ token");
          setMyTrainers([]);
          setStats({ totalSessions: 0, upcomingSessions: 0, favoritePTs: 0, hoursTrained: 0 });
          return;
        }

        // 2. Gọi API lấy bookings theo traineeId
        const bookings = await ptService.getMyBookings(traineeId); 
        console.log("Dữ liệu nhận được từ API /bookings/{traineeId}:", bookings);

        if (!bookings || bookings.length === 0) {
          setMyTrainers([]);
          setStats({ totalSessions: 0, upcomingSessions: 0, favoritePTs: 0, hoursTrained: 0 });
          return;
        }

        // 2. Gom nhóm theo Trainer ID (Dùng b.trainer theo JSON API)
        const trainerMap = new Map<number, { info: UserAPI, bookings: BookingAPI[] }>();
        
        bookings.forEach((b: any) => {
          const trainerInfo = b.bookingPackage?.trainer_id;
          if (!trainerInfo?.id) return;

          if (!trainerMap.has(trainerInfo.id)) {
            trainerMap.set(trainerInfo.id, {
              info: trainerInfo,
              bookings: []
            });
          }

          trainerMap.get(trainerInfo.id)!.bookings.push(b);

        });

        // 3. Biến đổi dữ liệu Map sang mảng UI
        const trainersList = Array.from(trainerMap.values()).map(
          ({ info, bookings: tBookings }) => {
        
            const sorted = [...tBookings].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
        
            const nextB = sorted.find(
              b => b.status === "PENDING" || b.status === "CONFIRMED"
            );
        
            return {
              id: info.id,
              name: info.fullName,
              specialty: info.specialty ?? "Huấn luyện viên cá nhân",
              location: info.address ?? "Việt Nam",
              image: `https://ui-avatars.com/api/?name=${encodeURIComponent(info.fullName)}&background=random&size=200`,
              rating: 5,
              reviews: 0,
              isFavorite: false,
              sessionsCompleted: tBookings.filter(b => b.status === "COMPLETED").length,
              nextSession: nextB ? formatNextSession(nextB.date) : "Chưa có lịch",
              statusNext: nextB?.status ?? "",
              lastBooked: formatTimeAgo(sorted[0].date),
              rawNextSessionDate: nextB ? new Date(nextB.date) : undefined
            };
          }
        );
        

        // 4. Sắp xếp PT: Ai có lịch gần nhất thì lên đầu
        const finalSorted = trainersList.sort((a, b) => 
          (a.rawNextSessionDate?.getTime() || Infinity) - (b.rawNextSessionDate?.getTime() || Infinity)
        );

        setMyTrainers(finalSorted);
        
        // 5. Tính toán Stats dựa trên toàn bộ bookings nhận được
        setStats({
          totalSessions: bookings.filter(b => b.status === "COMPLETED").length,
          upcomingSessions: bookings.filter(b => b.status === "PENDING" || b.status === "CONFIRMED").length,
          favoritePTs: 0,
          hoursTrained: bookings.filter(b => b.status === "COMPLETED").length,
        });

      } catch (e) {
        console.error("Lỗi fetch data MyPT:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" /> Quay lại Home
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Huấn luyện viên của tôi</h1>
          <p className="text-muted-foreground">Các huấn luyện viên bạn đã đặt lịch tập luyện (Sắp tới: {stats.upcomingSessions})</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Tổng số buổi", val: stats.totalSessions, icon: Trophy, color: "text-primary", bg: "bg-primary/10" },
            { label: "Sắp tới", val: stats.upcomingSessions, icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Yêu thích", val: stats.favoritePTs, icon: Heart, color: "text-green-500", bg: "bg-green-500/10" },
            { label: "Giờ tập", val: stats.hoursTrained, icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" }
          ].map((s, i) => (
            <Card key={i} className="p-6 border-border bg-card">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : s.val}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trainers List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {myTrainers.length > 0 ? (
              myTrainers.map((trainer) => (
                <Card key={trainer.id} className="p-6 border-border bg-card hover:shadow-lg transition-shadow">
                  <div className="flex gap-6">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-secondary">
                      <ImageWithFallback src={trainer.image} alt={trainer.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{trainer.name}</h3>
                          <p className="text-muted-foreground text-sm">{trainer.specialty} • {trainer.location}</p>
                        </div>
                        {trainer.statusNext === "PENDING" && (
                          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Đang chờ duyệt</Badge>
                        )}
                        {trainer.statusNext === "CONFIRMED" && (
                          <Badge className="bg-green-500/10 text-green-600 border-green-200">Đã xác nhận</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-6 mb-6">
                        <div>
                          <p className="text-muted-foreground text-xs uppercase">Đã hoàn thành</p>
                          <p className="font-bold text-foreground">{trainer.sessionsCompleted} buổi</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs uppercase">Đặt gần nhất</p>
                          <p className="font-bold text-foreground">{trainer.lastBooked}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs uppercase">Lịch tiếp theo</p>
                          <p className="font-bold text-primary">{trainer.nextSession}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button className="flex-1 font-bold" onClick={() => onBookSession(trainer.id)}>Đặt lịch lại</Button>
                        <Button variant="outline" className="flex-1" onClick={() => { setSelectedTrainer(trainer); setRateModalOpen(true); }}>Đánh giá</Button>
                        <Button variant="outline" onClick={() => onTrainerSelect(trainer.id)}>Hồ sơ</Button>
                        <Button variant="outline" size="icon" onClick={() => { setSelectedTrainer(trainer); setChatModalOpen(true); }}>
                          <MessageCircle className="w-5 h-5 text-foreground" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-20 text-center border-dashed border-2 bg-card">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-bold mb-2">Bạn chưa có huấn luyện viên nào</h3>
                <p className="text-muted-foreground mb-6">Hãy bắt đầu đặt lịch để huấn luyện viên xuất hiện tại đây.</p>
                <Button onClick={onBack}>Tìm huấn luyện viên</Button>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedTrainer && (
        <>
          <RatePTModal 
            isOpen={rateModalOpen} 
            onClose={() => {setRateModalOpen(false); setSelectedTrainer(null);}} 
            trainerId={selectedTrainer.id}
            trainerName={selectedTrainer.name} 
            trainerImage={selectedTrainer.image} 
          />
          <ChatWithPTModal 
            isOpen={chatModalOpen} 
            onClose={() => {setChatModalOpen(false); setSelectedTrainer(null);}} 
            trainerName={selectedTrainer.name} 
            trainerImage={selectedTrainer.image} 
            trainerId={selectedTrainer.id} 
          />
        </>
      )}
    </div>
  );
}