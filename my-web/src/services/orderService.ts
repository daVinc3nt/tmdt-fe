// src/services/orderService.ts
import axiosClient from './axiosClient';

export interface OrderRequest {
  userId: number | undefined;
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
}

const orderService = {
  // Gửi đơn hàng lên Backend
  createOrder: (data: OrderRequest) => {
    return axiosClient.post('/order', data);
  },

  // Lấy lịch sử đơn hàng từ Backend
  getOrdersByUserId: (userId: number) => {
    return axiosClient.get(`/order/${userId}`);
  }
};

export default orderService;