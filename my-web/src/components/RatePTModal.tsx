import { Loader2, Star, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ptService from "../services/ptService";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

// Helper function to decode JWT and get userId
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
    console.error("JWT decode error:", error);
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
  const { showError } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);


  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      showError("Please select a star rating.", "Missing rating");
      return;
    }

    // Get traineeId from JWT token
    const traineeIdFromToken = getUserIdFromToken(token);
    if (!traineeIdFromToken) {
      showError("Unable to verify user. Please sign in again.", "Authentication");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        comment: comment || "Great service",
        rating: Number(rating),
        traineeId: traineeIdFromToken,
        trainerId: Number(trainerId),
      };

      console.log("Review payload:", payload);

      await ptService.createReview(payload);

      setSuccess(true);        // Show success message
      setRating(0);
      setComment("");

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);

    } catch (error) {
      console.error("Failed to submit review:", error);
      showError("Failed to submit your review. Please try again.", "Review failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md p-8 bg-card border-border shadow-2xl relative">
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4"><X /></Button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Rate your trainer</h2>
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
                className={`w-10 h-10 cursor-pointer transition-colors ${s <= (hoveredRating || rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
                  }`}
              />
            ))}
          </div>

          <textarea
            placeholder="Write a review..."
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
              Review submitted successfully!
            </div>
          )}


          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || success}
            className="w-full py-6 font-bold"
          >
            {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Submit review"}
          </Button>
        </div>
      </Card>
    </div>
  );
}