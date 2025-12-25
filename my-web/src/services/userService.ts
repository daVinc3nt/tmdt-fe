import axiosClient from './axiosClient';

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  role: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE';
  goal?: string;
  height?: string;
  weight?: string;
  bio?: string;
  specialty?: string;
  experienceYear?: number;
  certificate?: string;
  address?: string;
  taxCode?: string;
  businessName?: string;
}

export interface UserUpdateData {
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
  fullName?: string;
  gender?: 'MALE' | 'FEMALE';
  goal?: string;
  height?: string;
  weight?: string;
  certificate?: string;
  bio?: string;
  specialty?: string;
  experienceYear?: number;
  address?: string;
  taxCode?: string;
  businessName?: string;
}

export const userService = {
  getCurrentUser: async (): Promise<UserProfile> => {
    const response = await axiosClient.get('/users/me');
    return response.data;
  },

  updateCurrentUser: async (data: UserUpdateData): Promise<UserProfile> => {
    const response = await axiosClient.put('/users/me', data);
    return response.data;
  },
};



