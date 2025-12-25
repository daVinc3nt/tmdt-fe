/**
 * MascotIcon - Tiger Head Mascot Logo
 */
// Xóa dòng import lỗi đi và dùng link ảnh trực tiếp bên dưới

export function MascotIcon({ className = "" }: { className?: string }) {
  // Link ảnh mẫu online (bạn có thể thay bằng link ảnh thật sau này)
  const tigerImage = "https://placehold.co/400x400/orange/white?text=Tiger+Logo"; 

  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}>
      {/* Tiger image */}
      <img 
        src={tigerImage} 
        alt="FitConnect Tiger" 
        className="w-[120%] h-[120%] object-contain"
      />
    </div>
  );
}