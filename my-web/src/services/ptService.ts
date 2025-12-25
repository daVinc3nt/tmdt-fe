import axiosClient from './axiosClient';

/* =======================
   API DATA TYPES (Backend)
======================= */

export interface UserAPI {
  id: number;
  role: string;
  phoneNumber: string;
  email: string;
  fullName: string;
  gender: string;
  specialty?: string;
  experienceYear?: number;
  certificate?: string;
  bio?: string;
  address?: string;
}

export interface PackageAPI {
  id: number;
  name: string;
  price: string;
  description?: string;
  type?: string;
  thumbNailUrl?: string;
  isActive?: boolean;
  duration?: number;
  trainer_id?: UserAPI;
}

export interface BookingAPI {
  id: number;
  date: string;
  status: string;
  totalAmount: number;
  trainee: UserAPI;
  bookingPackage: {
    id: number;
    name: string;
    price: number;
    trainer?: UserAPI;
    trainer_id?: UserAPI;
  };
}


export interface CreateBookingRequest {
  traineeId: number;
  packageId: number;
  date: string;
  totalAmount: number;
}

export interface ReviewAPI {
  id: number;
  reviewDate: string;
  comment: string;
  rating: number;
  user: UserAPI;    // Trainee
  trainer: UserAPI; // Trainer
}

export interface CreateReviewRequest {
  comment: string;
  rating: number;
  traineeId: number;
  trainerId: number;
}

/* =======================
   UI DATA TYPES
======================= */

export interface Trainer {
  id: number;
  name: string;
  specialization: string;
  avatar: string;
  rating: number;
  experience: number;
  bio?: string;
  certificate?: string;
}

/* =======================
   BOOKING SERVICE
======================= */

export const bookingService = {
  createBooking: async (data: CreateBookingRequest) => {
    const response = await axiosClient.post('/bookings', data);
    return response.data;
  },
};

/* =======================
   PT SERVICE
======================= */

const ptService = {
  // -----------------------
  // GET ALL TRAINERS
  // -----------------------
  getAllTrainers: async (params?: {
    fullName?: string;
    gender?: string;
    specialty?: string;
    minExp?: number;
  }): Promise<Trainer[]> => {
    const response = await axiosClient.get<UserAPI[]>('/users/trainers', {
      params,
    });

    const trainers = response.data ?? [];

    return trainers.map((t) => ({
      id: t.id,
      name: t.fullName ?? 'Trainer',
      specialization: t.specialty ?? 'General Fitness',
      experience: t.experienceYear ?? 1,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        t.fullName ?? 'Trainer'
      )}&background=random&size=200`,
      rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
    }));
  },

  // -----------------------
  // GET TRAINER BY ID
  // -----------------------
  getTrainerById: async (id: number): Promise<Trainer | null> => {
    try {
      const response = await axiosClient.get<UserAPI>(`/users/${id}`);
      const data = response.data;

      return {
        id: data.id,
        name: data.fullName ?? 'Trainer',
        specialization: data.specialty ?? 'General Fitness',
        experience: data.experienceYear ?? 1,
        bio:
          data.bio ??
          `Professional trainer specializing in ${data.specialty ?? 'fitness'}.`,
        certificate: data.certificate ?? 'Certified Personal Trainer',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          data.fullName ?? 'Trainer'
        )}&background=random&size=200`,
        rating: 0, // UI tự xử lý
      };
    } catch (error) {
      console.error('Failed to fetch trainer details:', error);
      return null;
    }
  },

  // -----------------------
  // GET REVIEWS BY TRAINER
  // -----------------------
  getReviewsByTrainerId: async (trainerId: number): Promise<ReviewAPI[]> => {
    try {
      const response = await axiosClient.get<ReviewAPI[]>(
        `/reviews/trainer/${trainerId}`
      );
      return response.data ?? [];
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      return [];
    }
  },

  getPackagesByTrainerId: async (trainerId: number): Promise<PackageAPI[]> => {
    try {
      const response = await axiosClient.get<PackageAPI[]>(`/packages/trainer/${trainerId}`);
      return response.data ?? [];
    } catch (error) {
      console.error('Failed to fetch trainer packages:', error);
      return [];
    }
  },

  // -----------------------
  // GET BOOKINGS BY TRAINEE
  // -----------------------
  getMyBookings: async (traineeId: number): Promise<BookingAPI[]> => {
    try {
      const response = await axiosClient.get<BookingAPI[]>(
        `/bookings/${traineeId}`
      );
      return response.data ?? [];
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      return [];
    }
  },

  // -----------------------
  // CREATE REVIEW
  // -----------------------
  createReview: async (data: CreateReviewRequest) => {
    const response = await axiosClient.post('/reviews', data);
    return response.data;
  },

  // -----------------------
  // GET ALL REVIEWS (ADMIN / DEBUG)
  // -----------------------
  getAllReviews: async (): Promise<ReviewAPI[]> => {
    try {
      const response = await axiosClient.get<ReviewAPI[]>('/reviews');
      return response.data ?? [];
    } catch (error) {
      console.error('Failed to fetch review list:', error);
      return [];
    }
  },
};

export default ptService;
