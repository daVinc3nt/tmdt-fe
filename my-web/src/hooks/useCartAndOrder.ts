import { useCallback, useState } from 'react';
import axiosClient from '../services/axiosClient';

export const useCart = (userId: number) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCart = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axiosClient.get(`/api/cart/${userId}`);
      setCartItems(response.data ?? []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addToCart = useCallback(
    async (productId: number, quantity: number = 1) => {
      if (!userId) {
        setError('User ID is required');
        return null;
      }
      setLoading(true);
      try {
        const response = await axiosClient.post('/api/cart/add', null, {
          params: { userId, productId, quantity },
        });
        const newItem = response.data;
        setCartItems(prev => [...prev, newItem]);
        setError(null);
        return newItem;
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const updateQuantity = useCallback(async (cartItemId: number, newQuantity: number) => {
    setLoading(true);
    try {
      const response = await axiosClient.put(`/api/cart/update/${cartItemId}`, null, {
        params: { quantity: newQuantity },
      });
      const updatedItem = response.data;
      setCartItems(prevItems =>
        prevItems.map(item => (item.id === cartItemId ? updatedItem : item))
      );
      setError(null);
      return updatedItem;
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(
    async (cartItemId: number) => {
      setLoading(true);
      try {
        await axiosClient.delete(`/api/cart/${cartItemId}`);
        setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
        setError(null);
        return true;
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearCart = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await axiosClient.delete(`/api/cart/clear/${userId}`);
      setCartItems([]);
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    cartItems,
    loading,
    error,
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };
};

export const useOrder = (userId: number) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrders = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axiosClient.get(`/api/order/${userId}`);
      setOrders(response.data ?? []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createOrder = useCallback(
    async (paymentMethod: string, shippingAddress: string, cartItemIds: number[]) => {
      if (!userId) {
        setError('User ID is required');
        return null;
      }
      setLoading(true);
      try {
        const response = await axiosClient.post(`/api/order/create/${userId}`, {
          paymentMethod,
          shippingAddress,
          cartItemIds,
        });
        const newOrder = response.data;
        if (newOrder.id) {
          setOrders(prev => [...prev, newOrder]);
        }
        setError(null);
        return newOrder;
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return {
    orders,
    loading,
    error,
    getOrders,
    createOrder
  };
};
