export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: string; // 'TRAINEE' | 'TRAINER' | 'BUSINESS' | 'ADMIN'
  gender?: 'MALE' | 'FEMALE';
  
  // Các cờ boolean
  isTrainee: boolean;
  isTrainer: boolean;
  isBusinesses: boolean;

  // Dữ liệu phụ
  dateOfBirth?: string;
  avatar?: string;
  goal?: string;
  height?: string;
  weight?: string;
  certificate?: string;
  bio?: string;
  specialty?: string;
  experienceYear?: number;
  businessName?: string;
  taxCode?: string;
  address?: string;
}

// BẮT BUỘC PHẢI CÓ INTERFACE NÀY VÀ PHẢI CÓ TỪ KHÓA 'export'
export interface LoginResponse {
  user: User;
  accessToken: string;
}
