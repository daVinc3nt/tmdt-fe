// src/services/orderService.ts
import axiosClient from './axiosClient';

interface CartItemResponseDTO {
  id: number;
}

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
  createOrder: async (data: any) => {
    const userId: number | undefined = data?.userId;
    if (!userId) {
      throw new Error('User ID is required');
    }

    const paymentMethod: string = data?.paymentMethod;
    const shippingAddress: string = data?.shippingAddress;
    if (!paymentMethod || !shippingAddress) {
      throw new Error('Payment method and shipping address are required');
    }

    let cartItemIds: number[] | undefined = data?.cartItemIds;

    if (!cartItemIds && Array.isArray(data?.items)) {
      const created = await Promise.all(
        data.items.map((item: any) =>
          axiosClient.post<CartItemResponseDTO>('/api/cart/add', null, {
            params: {
              userId,
              productId: item.productId,
              quantity: item.quantity,
            },
          })
        )
      );
      cartItemIds = created.map((r) => r.data.id);
    }

    if (!cartItemIds || cartItemIds.length === 0) {
      throw new Error('Cart items are required to create an order');
    }

    const response = await axiosClient.post(`/api/order/create/${userId}`, {
      paymentMethod,
      shippingAddress,
      cartItemIds,
    });
    return response.data;
  },

  // Lấy lịch sử đơn hàng từ Backend
  getOrdersByUserId: (userId: number) => {
    return axiosClient.get(`/api/order/${userId}`);
  }
};

export default orderService;