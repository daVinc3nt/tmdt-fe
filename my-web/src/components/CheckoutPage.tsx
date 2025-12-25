import { useCart, useOrder } from '@/hooks/useCartAndOrder';
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '../context/ToastContext';
import orderService, { type PaymentRequestDTO, type PaymentResponseDTO } from '../services/orderService';

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

    // VietQR payment states
    const [paymentStep, setPaymentStep] = useState<'idle' | 'created' | 'pending' | 'completed' | 'failed'>('idle');
    const [paymentResponse, setPaymentResponse] = useState<PaymentResponseDTO | null>(null);
    const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
    const [pollingCount, setPollingCount] = useState(0);
    const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const totalAmount = cartItems.reduce((sum: any, item: any) => sum + item.totalPrice, 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Poll payment status
    const startPaymentPolling = (orderId: number) => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }

        setPollingCount(0);
        setPaymentStep('pending');

        pollingIntervalRef.current = setInterval(async () => {
            try {
                const result = await orderService.verifyPayment(orderId);
                setPollingCount(prev => prev + 1);

                if (result.status === 'COMPLETED') {
                    setPaymentStep('completed');
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                        pollingIntervalRef.current = null;
                    }
                    showSuccess('Payment successful! Your order is confirmed.', 'Payment completed');
                    if (onOrderSuccess) {
                        onOrderSuccess(orderId);
                    }
                } else if (result.status === 'ERROR' || result.status === 'NOT_FOUND') {
                    setPaymentStep('failed');
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                        pollingIntervalRef.current = null;
                    }
                    showError(result.message || 'Payment failed. Please try again.', 'Payment failed');
                }

                // Timeout after ~2 minutes (40 polls * 3 seconds)
                if (pollingCount >= 40) {
                    setPaymentStep('failed');
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                        pollingIntervalRef.current = null;
                    }
                    showError('Payment timeout. Please check your payment and try again.', 'Payment timeout');
                }
            } catch (err: any) {
                console.error('Payment polling error:', err);
            }
        }, 3000);
    };

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

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
                setCreatedOrderId(result.id);

                // If VietQR selected, create payment and show QR
                if (formData.paymentMethod === 'BANK_TRANSFER') {
                    const paymentRequest: PaymentRequestDTO = {
                        userId,
                        orderId: result.id,
                        amount: totalAmount,
                        currency: 'VND',
                        description: `Order #${result.id} payment`
                    };

                    const paymentRes = await orderService.createVietQRPayment(paymentRequest);
                    setPaymentResponse(paymentRes);
                    setPaymentStep('created');
                    startPaymentPolling(result.id);
                } else {
                    // For other payment methods, show success immediately
                    showSuccess(
                        `Order #${result.id} has been created successfully. Total: ${result.totalPrice?.toLocaleString()} đ`,
                        'Order created'
                    );
                    if (onOrderSuccess) {
                        onOrderSuccess(result.id);
                    }
                }
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
                                    <span>VietQR (Bank Transfer)</span>
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
                            disabled={orderLoading || loading || paymentStep === 'created' || paymentStep === 'pending'}
                            className="w-full bg-blue-500 text-white py-3 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {orderLoading || loading ? 'Processing...' :
                                paymentStep === 'created' || paymentStep === 'pending' ? 'Payment in progress...' :
                                    'Place order'}
                        </button>
                    </form>

                    {/* VietQR Payment UI */}
                    {(paymentStep === 'created' || paymentStep === 'pending') && paymentResponse && (
                        <div className="mt-6 bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-4">VietQR Payment</h2>

                            <div className="text-center">
                                {paymentResponse.qrImageUrl && (
                                    <div className="mb-4">
                                        <img
                                            src={paymentResponse.qrImageUrl}
                                            alt="VietQR Payment"
                                            className="mx-auto max-w-xs border-2 border-gray-300 rounded"
                                        />
                                    </div>
                                )}

                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-2">Scan the QR code above to pay</p>
                                    <p className="font-semibold">Amount: {paymentResponse.amount?.toLocaleString()} đ</p>
                                    {paymentResponse.paymentRef && (
                                        <p className="text-sm text-gray-500 mt-1">Reference: {paymentResponse.paymentRef}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${paymentStep === 'pending' ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500'}`}></div>
                                    <span className="text-sm">
                                        {paymentStep === 'pending' ? 'Waiting for payment...' : 'Payment QR generated'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Completed UI */}
                    {paymentStep === 'completed' && (
                        <div className="mt-6 bg-green-50 border border-green-200 p-6 rounded-lg">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h3>
                                <p className="text-green-600">Your order has been confirmed and will be processed soon.</p>
                                {createdOrderId && (
                                    <p className="text-sm text-gray-600 mt-2">Order ID: #{createdOrderId}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Payment Failed UI */}
                    {paymentStep === 'failed' && (
                        <div className="mt-6 bg-red-50 border border-red-200 p-6 rounded-lg">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-red-800 mb-2">Payment Failed</h3>
                                <p className="text-red-600">The payment could not be completed. Please try again.</p>
                                <button
                                    onClick={() => setPaymentStep('idle')}
                                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}
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
