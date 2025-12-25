import axiosClient from './axiosClient';

export type BookingStatus = 'FINISHED' | 'PENDING' | 'CANCELLED';

export interface BookingUserAPI {
  id: number;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface BookingPackageAPI {
  id: number;
  name?: string;
  price?: string;
  description?: string;
  duration?: number;
  trainer_id?: BookingUserAPI;
  trainer?: BookingUserAPI;
}

export interface BookingAPI {
  id: number;
  date?: string;
  status?: BookingStatus;
  totalAmount?: number;
  trainee?: BookingUserAPI;
  bookingPackage?: BookingPackageAPI;
}

const bookingService = {
  getAllBookings: async (): Promise<BookingAPI[]> => {
    const response = await axiosClient.get<BookingAPI[]>('/bookings');
    return response.data ?? [];
  },

  updateStatus: async (bookingId: number, status: BookingStatus): Promise<BookingAPI> => {
    const response = await axiosClient.patch<BookingAPI>(`/bookings/${bookingId}/status`, null, {
      params: { status },
    });
    return response.data;
  },

  deleteBooking: async (bookingId: number): Promise<void> => {
    await axiosClient.delete(`/bookings/${bookingId}`);
  },
};

export default bookingService;
