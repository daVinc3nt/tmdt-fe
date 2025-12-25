import axiosClient from './axiosClient';

export interface CartItemResponseDTO {
  id: number;
  productId: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  productImage: string;
  quantity: number;
  totalPrice: number;
}

const cartService = {
  getCart: async (userId: number): Promise<CartItemResponseDTO[]> => {
    const response = await axiosClient.get<CartItemResponseDTO[]>(`/api/cart/${userId}`);
    return response.data ?? [];
  },

  addToCart: async (userId: number, productId: number, quantity: number = 1): Promise<CartItemResponseDTO> => {
    const response = await axiosClient.post<CartItemResponseDTO>('/api/cart/add', null, {
      params: { userId, productId, quantity },
    });
    return response.data;
  },

  updateQuantity: async (cartItemId: number, quantity: number): Promise<CartItemResponseDTO> => {
    const response = await axiosClient.put<CartItemResponseDTO>(`/api/cart/update/${cartItemId}`, null, {
      params: { quantity },
    });
    return response.data;
  },

  removeFromCart: async (cartItemId: number): Promise<void> => {
    await axiosClient.delete(`/api/cart/${cartItemId}`);
  },

  clearCart: async (userId: number): Promise<void> => {
    await axiosClient.delete(`/api/cart/clear/${userId}`);
  },
};

export default cartService;
