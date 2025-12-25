import React from 'react';
import { Shield } from 'lucide-react';

export function MascotFull({ className = "" }) {
  return (
    <div className={`relative inline-flex items-center justify-center gap-2 ${className}`}>
        <div className="flex items-center justify-center w-10 h-10 bg-orange-600 rounded-full text-white shadow-lg">
            <Shield size={20} fill="currentColor" />
        </div>
        <span className="font-bold text-2xl text-gray-900 tracking-tight">FitConnect</span>
    </div>
  );
}