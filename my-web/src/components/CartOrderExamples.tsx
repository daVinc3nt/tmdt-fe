import { useCart, useOrder } from '@/hooks/useCartAndOrder';
import { useEffect, useState } from 'react';

export const ProductCardWithAddToCart = ({ product, userId }: any) => {
    const { addToCart, loading, error } = useCart(userId);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        const result = await addToCart(product.id, quantity);
        if (result) {
            alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
            setQuantity(1); // Reset quantity
        } else {
            alert('Lỗi: ' + (error || 'Không thể thêm vào giỏ hàng'));
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
                <label>Số lượng:</label>
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
                {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
            </button>

            {product.stockQuantity === 0 && (
                <p className="text-red-500">Sản phẩm hết hàng</p>
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
                Xóa
            </button>
        </div>
    );
};

export const OrderHistoryComponent = ({ userId }: any) => {
    const { orders, loading, error, getOrders } = useOrder(userId);

    useEffect(() => {
        getOrders();
    }, [userId]);

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div className="text-red-500">Lỗi: {error}</div>;
    if (orders.length === 0) return <div>Chưa có đơn hàng</div>;

    return (
        <div className="orders-container">
            {orders.map((orderList: any) => (
                <div key={orderList.order.id} className="order-card">
                    <div className="order-header">
                        <h3>Đơn hàng #{orderList.order.id}</h3>
                        <span className={`status ${orderList.order.status?.toLowerCase()}`}>
                            {getStatusLabel(orderList.order.status)}
                        </span>
                    </div>

                    <div className="order-details">
                        <p>
                            <strong>Ngày đặt:</strong> {new Date(orderList.order.orderDate).toLocaleDateString('vi-VN')}
                        </p>
                        <p>
                            <strong>Địa chỉ:</strong> {orderList.order.shippingAddress}
                        </p>
                        <p>
                            <strong>Phương thức:</strong> {orderList.order.paymentMethod}
                        </p>
                    </div>

                    <div className="order-items">
                        <h4>Sản phẩm:</h4>
                        {orderList.orderItems.map((item: any) => (
                            <div key={item.id} className="order-item">
                                <span>{item.productName} x{item.quantity}</span>
                                <span>{(item.productPrice * item.quantity)?.toLocaleString()} đ</span>
                            </div>
                        ))}
                    </div>

                    <div className="order-total">
                        <strong>Tổng tiền:</strong>
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
        PENDING: 'Đang xử lý',
        FINISHED: 'Hoàn thành',
        CANCELLED: 'Đã hủy'
    };
    return (labels as any)[status] || status;
}

export const CartSummary = ({ cartItems }: any) => {
    const subtotal = cartItems.reduce((sum: any, item: any) => sum + item.totalPrice, 0);
    const shippingFee = subtotal > 500000 ? 0 : 30000; // Miễn phí vận chuyển nếu > 500k
    const total = subtotal + shippingFee;

    return (
        <div className="cart-summary">
            <div className="summary-row">
                <span>Tạm tính:</span>
                <span>{subtotal?.toLocaleString()} đ</span>
            </div>

            <div className="summary-row">
                <span>Vận chuyển:</span>
                <span>{shippingFee?.toLocaleString()} đ</span>
            </div>

            {shippingFee === 0 && (
                <p className="text-green-500 text-sm">Free shipping</p>
            )}

            <div className="summary-row total">
                <span>Tổng cộng:</span>
                <span className="text-xl font-bold">
                    {total?.toLocaleString()} đ
                </span>
            </div>

            <button className="btn-checkout">
                Tiến hành thanh toán
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
                    <p className="items-count">{totalItems} sản phẩm</p>
                    <p className="total">
                        {totalPrice?.toLocaleString()} đ
                    </p>
                    <a href="/cart" className="btn-view-cart">
                        Xem giỏ hàng
                    </a>
                </div>
            )}
        </div>
    );
};

export const AdvancedCheckoutForm = ({ userId, cartItems, onSuccess }: any) => {
    const { createOrder, loading, error } = useOrder(userId);
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
            alert('Order created successfully!');
            if (onSuccess) onSuccess(result);
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
                    placeholder="Họ tên"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                />

                <input
                    type="tel"
                    placeholder="Số điện thoại"
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
                    placeholder="Địa chỉ chi tiết"
                    value={form.shippingAddress}
                    onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                    required
                />

                <select
                    value={form.shippingCity}
                    onChange={(e) => setForm({ ...form, shippingCity: e.target.value })}
                    required
                >
                    <option value="">Chọn thành phố</option>
                    <option value="TP.HCM">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
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
                    Thanh toán khi nhận hàng
                </label>

                <label>
                    <input
                        type="radio"
                        name="payment"
                        value="CREDIT_CARD"
                        checked={form.paymentMethod === 'CREDIT_CARD'}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    />
                    Thẻ tín dụng
                </label>

                <label>
                    <input
                        type="radio"
                        name="payment"
                        value="BANK_TRANSFER"
                        checked={form.paymentMethod === 'BANK_TRANSFER'}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    />
                    Chuyển khoản ngân hàng
                </label>
            </div>

            <div className="order-summary">
                <div className="summary-row">
                    <span>Tạm tính:</span>
                    <span>{subtotal?.toLocaleString()} đ</span>
                </div>
                <div className="summary-row">
                    <span>Vận chuyển:</span>
                    <span>{shippingFee?.toLocaleString()} đ</span>
                </div>
                <div className="summary-row total">
                    <span>Tổng cộng:</span>
                    <span className="font-bold">{total?.toLocaleString()} đ</span>
                </div>
            </div>

            {error && <p className="text-red-500">Lỗi: {error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="btn-submit"
            >
                {loading ? 'Đang xử lý...' : `Đặt hàng (${total?.toLocaleString()} đ)`}
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
