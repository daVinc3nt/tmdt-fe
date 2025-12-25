import { useCart, useOrder } from '@/hooks/useCartAndOrder';
import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';

export const ProductCardWithAddToCart = ({ product, userId }: any) => {
    const { addToCart, loading, error } = useCart(userId);
    const { showError, showSuccess } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        const result = await addToCart(product.id, quantity);
        if (result) {
            showSuccess(`Added ${quantity} ${product.name} to your cart.`, 'Added to cart');
            setQuantity(1); // Reset quantity
        } else {
            showError(error || 'Unable to add item to cart.', 'Add to cart failed');
        }
        setIsAdding(false);
    };

    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">{product.price?.toLocaleString()} đ</p>

            <div className="quantity-selector">
                <label>Quantity:</label>
                <input
                    type="number"
                    min="1"
                    max={product.stockQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    disabled={isAdding}
                />
            </div>

            <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stockQuantity === 0}
                className="btn-add-to-cart"
            >
                {isAdding ? 'Adding...' : 'Add to cart'}
            </button>

            {product.stockQuantity === 0 && (
                <p className="text-red-500">Out of stock</p>
            )}
        </div>
    );
};

export const CartItemComponent = ({ item, onUpdateQuantity, onRemove }: any) => {
    const handleQuantityChange = (e: any) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity > 0) {
            onUpdateQuantity(item.id, newQuantity);
        }
    };

    return (
        <div className="cart-item">
            <div className="item-image">
                <img src={item.productImage} alt={item.productName} />
            </div>

            <div className="item-info">
                <h3>{item.productName}</h3>
                <p className="description">{item.productDescription}</p>
                <p className="price">{item.productPrice?.toLocaleString()} đ</p>
            </div>

            <div className="item-quantity">
                <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={handleQuantityChange}
                />
            </div>

            <div className="item-total">
                <p className="font-bold">
                    {item.totalPrice?.toLocaleString()} đ
                </p>
            </div>

            <button
                onClick={() => onRemove(item.id)}
                className="btn-remove"
            >
                Remove
            </button>
        </div>
    );
};

export const OrderHistoryComponent = ({ userId }: any) => {
    const { orders, loading, error, getOrders } = useOrder(userId);

    useEffect(() => {
        getOrders();
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (orders.length === 0) return <div>No orders yet</div>;

    return (
        <div className="orders-container">
            {orders.map((orderList: any) => (
                <div key={orderList.order.id} className="order-card">
                    <div className="order-header">
                        <h3>Order #{orderList.order.id}</h3>
                        <span className={`status ${orderList.order.status?.toLowerCase()}`}>
                            {getStatusLabel(orderList.order.status)}
                        </span>
                    </div>

                    <div className="order-details">
                        <p>
                            <strong>Placed on:</strong> {new Date(orderList.order.orderDate).toLocaleDateString('en-US')}
                        </p>
                        <p>
                            <strong>Address:</strong> {orderList.order.shippingAddress}
                        </p>
                        <p>
                            <strong>Payment:</strong> {orderList.order.paymentMethod}
                        </p>
                    </div>

                    <div className="order-items">
                        <h4>Items:</h4>
                        {orderList.orderItems.map((item: any) => (
                            <div key={item.id} className="order-item">
                                <span>{item.productName} x{item.quantity}</span>
                                <span>{(item.productPrice * item.quantity)?.toLocaleString()} đ</span>
                            </div>
                        ))}
                    </div>

                    <div className="order-total">
                        <strong>Total:</strong>
                        <span className="font-bold">
                            {orderList.order.totalPrice?.toLocaleString()} đ
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

function getStatusLabel(status: any) {
    const labels = {
        PENDING: 'Processing',
        FINISHED: 'Completed',
        CANCELLED: 'Cancelled'
    };
    return (labels as any)[status] || status;
}

export const CartSummary = ({ cartItems }: any) => {
    const subtotal = cartItems.reduce((sum: any, item: any) => sum + item.totalPrice, 0);
    const shippingFee = subtotal > 500000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    return (
        <div className="cart-summary">
            <div className="summary-row">
                <span>Subtotal:</span>
                <span>{subtotal?.toLocaleString()} đ</span>
            </div>

            <div className="summary-row">
                <span>Shipping:</span>
                <span>{shippingFee?.toLocaleString()} đ</span>
            </div>

            {shippingFee === 0 && (
                <p className="text-green-500 text-sm">Free shipping</p>
            )}

            <div className="summary-row total">
                <span>Total:</span>
                <span className="text-xl font-bold">
                    {total?.toLocaleString()} đ
                </span>
            </div>

            <button className="btn-checkout">
                Proceed to checkout
            </button>
        </div>
    );
};

export const MiniCart = ({ userId }: any) => {
    const { cartItems, getCart } = useCart(userId);

    useEffect(() => {
        getCart();
    }, [userId]);

    const totalItems = cartItems.reduce((sum: any, item: any) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum: any, item: any) => sum + item.totalPrice, 0);

    return (
        <div className="mini-cart">
            <a href="/cart" className="cart-icon">
                Cart
                {totalItems > 0 && (
                    <span className="badge">{totalItems}</span>
                )}
            </a>

            {totalItems > 0 && (
                <div className="cart-preview">
                    <p className="items-count">{totalItems} items</p>
                    <p className="total">
                        {totalPrice?.toLocaleString()} đ
                    </p>
                    <a href="/cart" className="btn-view-cart">
                        View cart
                    </a>
                </div>
            )}
        </div>
    );
};

export const AdvancedCheckoutForm = ({ userId, cartItems, onSuccess }: any) => {
    const { createOrder, loading, error } = useOrder(userId);
    const { showError, showSuccess } = useToast();
    const [form, setForm] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        shippingAddress: '',
        shippingWard: '',
        shippingDistrict: '',
        shippingCity: '',
        paymentMethod: 'COD',
        notes: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitted(true);

        // Build full address
        const fullAddress = `${form.shippingAddress}, ${form.shippingWard}, ${form.shippingDistrict}, ${form.shippingCity}`;

        // Get cart item IDs
        const cartItemIds = cartItems.map((item: any) => item.id);

        // Create order
        const result = await createOrder(
            form.paymentMethod,
            fullAddress,
            cartItemIds
        );

        if (result && result.id) {
            showSuccess('Order created successfully!', 'Order created');
            if (onSuccess) onSuccess(result);
        } else {
            showError(result?.message || 'Failed to create order.', 'Order failed');
        }
    };

    const subtotal = cartItems.reduce((sum: any, item: any) => sum + item.totalPrice, 0);
    const shippingFee = 30000;
    const total = subtotal + shippingFee;

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
                <h3>Shipping Information</h3>

                <input
                    type="text"
                    placeholder="Full name"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                />

                <input
                    type="tel"
                    placeholder="Phone number"
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />

                <textarea
                    placeholder="Detailed address"
                    value={form.shippingAddress}
                    onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                    required
                />

                <select
                    value={form.shippingCity}
                    onChange={(e) => setForm({ ...form, shippingCity: e.target.value })}
                    required
                >
                    <option value="">Select a city</option>
                    <option value="TP.HCM">Ho Chi Minh City</option>
                    <option value="Hà Nội">Hanoi</option>
                    <option value="Đà Nẵng">Da Nang</option>
                </select>
            </div>

            <div className="form-section">
                <h3>Payment Method</h3>

                <label>
                    <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={form.paymentMethod === 'COD'}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    />
                    Cash on delivery
                </label>

                <label>
                    <input
                        type="radio"
                        name="payment"
                        value="CREDIT_CARD"
                        checked={form.paymentMethod === 'CREDIT_CARD'}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    />
                    Credit card
                </label>

                <label>
                    <input
                        type="radio"
                        name="payment"
                        value="BANK_TRANSFER"
                        checked={form.paymentMethod === 'BANK_TRANSFER'}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    />
                    Bank transfer
                </label>
            </div>

            <div className="order-summary">
                <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>{subtotal?.toLocaleString()} đ</span>
                </div>
                <div className="summary-row">
                    <span>Shipping:</span>
                    <span>{shippingFee?.toLocaleString()} đ</span>
                </div>
                <div className="summary-row total">
                    <span>Total:</span>
                    <span className="font-bold">{total?.toLocaleString()} đ</span>
                </div>
            </div>

            {error && <p className="text-red-500">Error: {error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="btn-submit"
            >
                {loading ? 'Processing...' : `Place order (${total?.toLocaleString()} đ)`}
            </button>
        </form>
    );
};

export default {
    ProductCardWithAddToCart,
    CartItemComponent,
    OrderHistoryComponent,
    CartSummary,
    MiniCart,
    AdvancedCheckoutForm
};
