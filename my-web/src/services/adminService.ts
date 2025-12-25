import axiosClient from './axiosClient';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface Order {
  id: number;
  paymentMethod: string;
  status: 'PENDING' | 'FINISHED' | 'CANCELLED';
  totalPrice: number;
  shippingAddress: string;
  orderDate: string;
}

export interface OrderListResponse {
  order: Order;
  orderItems: any[];
}

export interface RevenueStats {
  totalRevenue: number;
  chartData: Array<{ month: string; revenue: number }>;
}

export const adminService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await axiosClient.get('/users');
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await axiosClient.delete(`/users/${id}`);
  },

  getAllOrders: async (): Promise<OrderListResponse[]> => {
    const response = await axiosClient.get('/api/order/all');
    return response.data;
  },

  updateOrderStatus: async (id: number, status: 'PENDING' | 'FINISHED' | 'CANCELLED'): Promise<Order> => {
    const response = await axiosClient.put(`/api/order/${id}/status`, { status });
    return response.data;
  },

  getRevenueStats: async (year: number = 2025): Promise<RevenueStats> => {
    const response = await axiosClient.get(`/api/admin/revenue?year=${year}`);
    const data = response.data;
    console.log("getRevenueStats service: ", data);
    return {
      totalRevenue: data.totalRevenue || 0,
      chartData: (data.chartData || []).map((item: any) => ({
        month: item.month || '',
        revenue: typeof item.revenue === 'number' ? item.revenue : Number(item.revenue) || 0
      }))
    };
  },
};



