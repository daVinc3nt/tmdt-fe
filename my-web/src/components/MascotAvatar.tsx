/**
 * MascotAvatar - Circular Tiger Avatar
 * For: User Profile, Chat, Comments
 * Style: Professional sports logo with circular badge and brand border
 */
import tigerImage from 'figma:asset/1aaa74142f57129ef03e813ba2a48c874fe443db.png';

export function MascotAvatar({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* White circular background */}
      <div className="absolute inset-0 bg-white rounded-full" 
           style={{ boxShadow: 'inset 0 0 0 3px #FF7A00' }} />
      
      {/* Tiger image - centered */}
      <img 
        src={tigerImage} 
        alt="FitConnect Tiger" 
        className="relative w-full h-full object-contain p-[12%]"
      />
    </div>
  );
}
