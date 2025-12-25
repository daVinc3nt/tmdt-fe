import { useCart, useOrder } from '@/hooks/useCartAndOrder';
import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface CheckoutPageProps {
    userId: number;
    onOrderSuccess?: (orderId: number) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ userId, onOrderSuccess }) => {
    const { cartItems, getCart: refreshCart } = useCart(userId);
    const { createOrder, loading, error } = useOrder(userId);
    const { showError, showSuccess } = useToast();

    const [formData, setFormData] = useState({
        paymentMethod: 'CREDIT_CARD',
        shippingAddress: '',
        phoneNumber: '',
        fullName: ''
    });

    const [orderLoading, setOrderLoading] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);

    const totalAmount = cartItems.reduce((sum: any, item: any) => sum + item.totalPrice, 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.shippingAddress.trim()) {
            setOrderError('Please enter a shipping address.');
            return;
        }

        if (cartItems.length === 0) {
            setOrderError('Your cart is empty.');
            return;
        }

        setOrderLoading(true);
        setOrderError(null);

        try {
            const cartItemIds = cartItems.map((item: any) => item.id);
            const result = await createOrder(
                formData.paymentMethod,
                formData.shippingAddress,
                cartItemIds
            );

            if (result && result.id) {
                await refreshCart();

                if (onOrderSuccess) {
                    onOrderSuccess(result.id);
                }

                showSuccess(
                    `Order #${result.id} has been created successfully. Total: ${result.totalPrice?.toLocaleString()} đ`,
                    'Order created'
                );
            } else {
                const msg = result?.message || 'Failed to create order.';
                setOrderError(msg);
                showError(msg, 'Order failed');
            }
        } catch (err: any) {
            setOrderError(err.message);
            showError(err.message, 'Order failed');
        } finally {
            setOrderLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="p-4 text-center">
                <p className="text-lg">Your cart is empty. Please add items before checkout.</p>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-4">Customer information</h2>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Full name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Phone number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-4">Shipping address</h2>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <textarea
                                    name="shippingAddress"
                                    value={formData.shippingAddress}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        shippingAddress: e.target.value
                                    }))}
                                    className="w-full px-4 py-2 border rounded"
                                    rows={3}
                                    placeholder="Example: 123 ABC Street, Ward XYZ, District 1, Ho Chi Minh City"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-4">Payment method</h2>

                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="CREDIT_CARD"
                                        checked={formData.paymentMethod === 'CREDIT_CARD'}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    <span>Credit card</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="BANK_TRANSFER"
                                        checked={formData.paymentMethod === 'BANK_TRANSFER'}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    <span>Bank transfer</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={formData.paymentMethod === 'COD'}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    <span>Cash on delivery</span>
                                </label>
                            </div>
                        </div>

                        {(error || orderError) && (
                            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error || orderError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={orderLoading || loading}
                            className="w-full bg-blue-500 text-white py-3 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {orderLoading || loading ? 'Processing...' : 'Place order'}
                        </button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-lg shadow h-fit">
                    <h2 className="text-lg font-semibold mb-4">Order summary</h2>

                    <div className="space-y-3 mb-6 border-b pb-6">
                        {cartItems.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <div>
                                    <p>{item.productName}</p>
                                    <p className="text-gray-600">x{item.quantity}</p>
                                </div>
                                <p className="font-semibold">{item.totalPrice?.toLocaleString()} đ</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{totalAmount?.toLocaleString()} đ</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping fee:</span>
                            <span>0 đ</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>{totalAmount?.toLocaleString()} đ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
