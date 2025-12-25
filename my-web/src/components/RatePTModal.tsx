import { X, Star, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useState } from "react";
import ptService from "../services/ptService";
import { useAuth } from "../context/AuthContext";

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

interface RatePTModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainerId: number; 
  trainerName: string;
  trainerImage: string;
}

export function RatePTModal({ isOpen, onClose, trainerId, trainerName, trainerImage }: RatePTModalProps) {
  const { token } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);


  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá!");
      return;
    }

    // Lấy traineeId từ JWT token
    const traineeIdFromToken = getUserIdFromToken(token);
    if (!traineeIdFromToken) {
      alert("Không thể xác thực người dùng. Vui lòng đăng nhập lại.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        comment: comment || "Dịch vụ rất tốt", // Không để trống comment
        rating: Number(rating),
        traineeId: traineeIdFromToken,
        trainerId: Number(trainerId), // trainerId lấy từ props truyền xuống
      };

      console.log("Payload gửi đi:", payload); // Kiểm tra log này phải có 4 trường

      await ptService.createReview(payload);

      setSuccess(true);        // hiện thông báo thành công
      setRating(0);
      setComment("");

      setTimeout(() => {
        setSuccess(false);
        onClose();             // đóng modal sau 1.2s
      }, 1200);

    } catch (error) {
      console.error("Lỗi gửi đánh giá:", error);
      alert("Gửi đánh giá thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md p-8 bg-card border-border shadow-2xl relative">
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4"><X /></Button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Đánh giá huấn luyện viên</h2>
          <p className="text-muted-foreground">{trainerName}</p>
        </div>

        <div className="flex flex-col items-center gap-6">
          {/* Avatar PT */}
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img src={trainerImage} alt="" className="w-full h-full object-cover" />
          </div>

          {/* Star Rating */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                onClick={() => setRating(s)}
                onMouseEnter={() => setHoveredRating(s)}
                onMouseLeave={() => setHoveredRating(0)}
                className={`w-10 h-10 cursor-pointer transition-colors ${
                  s <= (hoveredRating || rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <textarea
            placeholder="Viết nhận xét..."
            className="w-full h-32 p-4 rounded-xl border border-border bg-background"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {success && (
            <div className="w-full flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-3 text-green-600 text-sm animate-in fade-in">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Gửi đánh giá thành công!
            </div>
          )}


          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || success}
            className="w-full py-6 font-bold"
          >
            {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Gửi đánh giá"}
          </Button>
        </div>
      </Card>
    </div>
  );
}