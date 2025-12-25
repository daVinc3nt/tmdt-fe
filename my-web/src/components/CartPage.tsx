import { useCart } from '@/hooks/useCartAndOrder';
import React, { useEffect, useState } from 'react';

interface CartItem {
    id: number;
    productId: number;
    productName: string;
    productDescription: string;
    productPrice: number;
    productImage: string;
    quantity: number;
    totalPrice: number;
}

interface CartPageProps {
    userId: number;
}

const CartPage: React.FC<CartPageProps> = ({ userId }) => {
    const { cartItems, loading, error, getCart, updateQuantity, removeFromCart } = useCart(userId);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        getCart();
    }, [userId]);

    useEffect(() => {
        const total = cartItems.reduce((sum: any, item: any) => sum + item.totalPrice, 0);
        setTotalAmount(total);
    }, [cartItems]);

    const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        await updateQuantity(cartItemId, newQuantity);
    };

    const handleRemoveItem = async (cartItemId: number) => {
        await removeFromCart(cartItemId);
    };

    if (loading) {
        return <div className="p-4">Đang tải giỏ hàng...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Lỗi: {error}</div>;
    }

    if (cartItems.length === 0) {
        return (
            <div className="p-4 text-center">
                <p>Giỏ hàng của bạn trống</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Giỏ Hàng</h1>

            <div className="space-y-4">
                {cartItems.map((item: CartItem) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                        <div className="w-24 h-24">
                            <img
                                src={item.productImage || 'https://via.placeholder.com/100'}
                                alt={item.productName}
                                className="w-full h-full object-cover rounded"
                            />
                        </div>

                        <div className="flex-1">
                            <h3 className="font-semibold">{item.productName}</h3>
                            <p className="text-gray-600 text-sm">{item.productDescription}</p>
                            <p className="text-lg font-bold mt-2">
                                {item.productPrice?.toLocaleString()} đ
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="px-2 py-1 border rounded"
                            >
                                -
                            </button>
                            <span className="px-4">{item.quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="px-2 py-1 border rounded"
                            >
                                +
                            </button>
                        </div>

                        <div className="text-right">
                            <p className="font-semibold">
                                {item.totalPrice?.toLocaleString()} đ
                            </p>
                        </div>

                        <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Xóa
                        </button>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="mt-8 p-4 border-t">
                <div className="flex justify-between mb-4">
                    <span className="font-semibold">Tổng tiền:</span>
                    <span className="text-xl font-bold">
                        {totalAmount?.toLocaleString()} đ
                    </span>
                </div>
                <button className="w-full bg-blue-500 text-white py-2 rounded font-semibold">
                    Thanh toán
                </button>
            </div>
        </div>
    );
};

export default CartPage;
