import { ArrowLeft, Banknote, Check, Clock, Loader2, MapPin, Minus, Plus, QrCode, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import orderService from "../services/orderService";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import axiosClient from "@/services/axiosClient";
import { useNavigate } from "react-router-dom";

// Helper function to decode JWT and get userId
const getUserIdFromToken = (token: string | null): number | null => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.userId || null;
  } catch (error) {
    console.error("JWT decode error:", error);
    return null;
  }
};

interface DesktopCartProps {
  cartItems: any[];
  onBack: () => void;
  onCheckout: () => void;
  onUpdateQuantity: (id: any, newQuantity: number) => void;
  onRemoveItem: (id: any) => void;
  onClearCart: () => void;
}

function PaymentHistoryList() {
  const { token } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      const userId = getUserIdFromToken(token);
      if (!userId) return;
      try {
        setLoading(true);
        const data = await orderService.getPaymentHistory(userId);
        setPayments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch payment history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [token]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-orange-500" /></div>;
  if (payments.length === 0) return <div className="text-center p-20 text-muted-foreground">No payment history found.</div>;

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id} className="p-6 border-zinc-200 hover:border-orange-200 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg text-zinc-800">Payment #{payment.id}</span>
                <Badge variant={payment.status === 'COMPLETED' ? 'default' : 'destructive'}
                  className={payment.status === 'COMPLETED' ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600 text-black"}>
                  {payment.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(payment.createdAt || Date.now()).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className="font-bold text-xl text-orange-600">
                {payment.amount?.toLocaleString()} {payment.currency}
              </span>
              <p className="text-xs text-muted-foreground uppercase">{payment.paymentMethod}</p>
            </div>
          </div>

          <div className="bg-zinc-50 p-4 rounded-lg text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Ref:</span>
              <span className="font-medium">#{payment.order?.id || 'N/A'}</span>
            </div>
            {payment.paymentRef && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Ref:</span>
                <span className="font-mono text-xs">{payment.paymentRef}</span>
              </div>
            )}
            {payment.sepayTransactionRef && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">SePay Trans ID:</span>
                <span className="font-mono text-xs">{payment.sepayTransactionRef}</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

export function DesktopCart({ cartItems, onBack, onCheckout, onUpdateQuantity, onRemoveItem, onClearCart }: DesktopCartProps) {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { showError, showSuccess } = useToast();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout'>('cart');
  const [isQRPage, setIsQRPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({ fullName: "", phone: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'banking'>('cod');
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // --- FETCH ORDER HISTORY (Now using Payment History as source based on user request) ---
  useEffect(() => {
    const fetchOrderHistory = async () => {
      const userId = getUserIdFromToken(token);
      if (!userId) return;
      try {
        setLoadingHistory(true);
        const response = await orderService.getOrdersByUserId(userId);
        const data = (response as any).data || response;
        console.log("Order history data:", data);
        setOrderHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch order history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchOrderHistory();
  }, [token, checkoutStep]);

  // --- COUNTDOWN TIMER ---
  const [timeLeft, setTimeLeft] = useState(600);
  useEffect(() => {
    let timer: any;
    if (isQRPage && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsQRPage(false);
      setTimeLeft(600);
    }
    return () => clearInterval(timer);
  }, [isQRPage, timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- COSTS ---
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedPromo === "SAVE10" ? subtotal * 0.1 : 0;
  const shipping = subtotal > 1000000 ? 0 : 30000;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  // State QR
  const [vietQr, setVietQr] = useState(null);
  const [orderId, setOrderId] = useState(null);
  // --- SUBMIT ORDER TO API ---
  const handlePayment = async () => {
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      showError("Please fill in all shipping information.", "Missing information");
      return;
    }

    // Get userId from JWT token
    const userId = getUserIdFromToken(token);
    if (!userId) {
      showError("Unable to verify user. Please sign in again.", "Authentication");
      return;
    }

    setIsLoading(true);
    try {
      const orderRequest = {
        userId,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        shippingAddress: `${shippingInfo.fullName} | ${shippingInfo.phone} | ${shippingInfo.address}`,
        paymentMethod: paymentMethod === 'banking' ? 'BANK_TRANSFER' : 'COD' // Map 'banking' to 'BANK_TRANSFER'
      };

      const orderRes = await orderService.createOrder(orderRequest as any);
      setOrderId(orderRes.id);
      if (paymentMethod === 'banking') {
        // Call api 
        const payload = {
          userId: userId,
          orderId: orderRes.id,
          amount: total,
          currency: "VND",
          description: "Phong"
        }
        const qr = await axiosClient.post('/payments/vietqr', payload);
        console.log("qrRes: ", qr);
        setVietQr(qr.data.qrImageUrl)
        setIsQRPage(true);
        setPaymentStep('created');

        // Start polling
        startPaymentPolling(orderResult.id);

      } else {
        showSuccess("Your order has been placed successfully.", "Order placed");
        completeOrder();
      }
    } catch (error: any) {
      // Xử lý lỗi 403 Forbidden từ Backend
      if (error.response?.status === 403) {
        showError("Security error (403): your token may be expired or you don't have permission. Please sign in again.", "Authorization");
      } else {
        showError("The system is busy or order failed. Please try again later.", "Order failed");
      }
      console.error("Order API error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOrder = async () => {

    try {
      const verify = await axiosClient.get(`/payments/verify`, {
        params: {
          orderId: orderId
        }
      });
      console.log("veri1fy: ", verify);
      if (verify.status === 200) {
        onClearCart();
        setCheckoutStep('cart');
        setIsQRPage(false);
        onCheckout();
        setOrderId(null);
        setVietQr(null);
        showSuccess("Thanh toán thành công!", "Thanh toán thành công");
        navigate("/home");
      }
    } catch (error) {
      alert("Chưa thanh toán! Vui lòng hoàn tất thanh toán trước khi xác nhận.");
      console.error("Complete order error:", error);
    }

  };

  // RENDER SECTION
  if (isQRPage) {
    return (
      <div className="fixed inset-0 bg-zinc-100 z-[100] flex items-center justify-center animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-4xl h-[620px] shadow-2xl rounded-2xl overflow-hidden flex font-sans">
          <div className="w-[35%] bg-[#A50064] p-8 text-white flex flex-col justify-between">
            <div className="space-y-10">
              <div>
                <p className="text-sm opacity-80 mb-1 flex items-center gap-2"><Clock className="w-4 h-4" /> Order expires in</p>
                <p className="text-4xl font-mono font-bold tracking-wider">{formatTimer(timeLeft)}</p>
              </div>
              <div className="space-y-6 text-sm">
                <div><p className="opacity-60 mb-1 uppercase text-[10px] tracking-widest">Merchant</p><p className="font-bold text-lg">FITCONNECT STORE</p></div>
                <div><p className="opacity-60 mb-1 uppercase text-[10px] tracking-widest">Amount</p><p className="font-bold text-2xl">{total.toLocaleString()}đ</p></div>
                <div><p className="opacity-60 mb-1 uppercase text-[10px] tracking-widest">Note</p><p className="leading-relaxed font-medium text-xs">FitConnect payment for {shippingInfo.fullName}</p></div>
              </div>
            </div>
            <Button variant="ghost" className="text-white hover:bg-white/10 self-start gap-2" onClick={() => setIsQRPage(false)}>
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </div>
          <div className="flex-1 p-12 flex flex-col items-center justify-center bg-white relative text-foreground">
            <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="h-12 w-12 object-contain mb-2" />
            <h2 className="text-xl font-bold mb-8 text-zinc-800">Scan MoMo QR to pay</h2>
            <div className="p-4 border-2 border-zinc-100 rounded-2xl bg-white shadow-lg mb-6">
              <img src={vietQr || ""} alt="QR" className="w-48 h-48" />
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-500 mb-8">
              <Loader2 className="w-4 h-4 animate-spin text-[#A50064]" /> <p>Waiting for confirmation...</p>
            </div>
            <Button className="w-full bg-[#A50064] hover:bg-[#820050] text-white py-7 rounded-xl font-bold text-lg" onClick={completeOrder}>
              I have completed the transfer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutStep === 'checkout') {
    return (
      <div className="min-h-screen bg-background pb-20 font-sans">
        <div className="border-b border-border bg-white sticky top-0 z-10 px-6 py-4 flex justify-between items-center text-orange-500 font-bold">
          <Button variant="ghost" onClick={() => setCheckoutStep('cart')} className="gap-2"><ArrowLeft className="w-4 h-4" /> Back to cart</Button>
          <span className="text-xl">Checkout</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 border-border">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-orange-600"><MapPin className="w-5 h-5" /> Shipping information</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2"><Label>Recipient name</Label><Input value={shippingInfo.fullName} onChange={e => setShippingInfo({ ...shippingInfo, fullName: e.target.value })} className="border-orange-200" placeholder="John Doe" /></div>
                  <div className="space-y-2"><Label>Phone number</Label><Input value={shippingInfo.phone} onChange={e => setShippingInfo({ ...shippingInfo, phone: e.target.value })} className="border-orange-200" placeholder="0909xxxxxx" /></div>
                  <div className="col-span-2 space-y-2"><Label>Detailed address</Label><Input value={shippingInfo.address} onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })} className="border-orange-200" placeholder="House number, street, ward..." /></div>
                </div>
              </Card>
              <Card className="p-6 border-border text-foreground">
                <h2 className="text-lg font-semibold mb-6">Payment method</h2>
                <div className="space-y-3">
                  <div className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-zinc-200'}`} onClick={() => setPaymentMethod('cod')}>
                    <Banknote className="w-6 h-6 text-green-600" /> <div><p className="font-bold">COD</p><p className="text-xs text-muted-foreground">Cash on delivery</p></div>
                  </div>
                  <div className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'banking' ? 'border-orange-500 bg-orange-50' : 'border-zinc-200'}`} onClick={() => setPaymentMethod('banking')}>
                    <QrCode className="w-6 h-6 text-[#A50064]" /> <div><p className="font-bold">VietQR Bank Transfer</p><p className="text-xs text-muted-foreground">Scan QR code to pay instantly</p></div>
                  </div>
                </div>
              </Card>

            </div>

            <Card className="p-6 border-border h-fit sticky top-24 shadow-sm bg-zinc-50/50">
              <h3 className="font-bold text-lg mb-4 text-orange-600">Order summary</h3>
              <div className="space-y-3 text-sm mb-6 text-foreground">
                <div className="flex justify-between"><span>Subtotal ({cartItems.length} items)</span><span>{subtotal.toLocaleString()}đ</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `${shipping.toLocaleString()}đ`}</span></div>
                <div className="flex justify-between"><span>VAT (8%)</span><span>{tax.toLocaleString()}đ</span></div>
                {appliedPromo && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{discount.toLocaleString()}đ</span></div>}
                <Separator />
                <div className="flex justify-between font-bold text-xl text-orange-600"><span>Total</span><span>{total.toLocaleString()}đ</span></div>
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg font-bold rounded-xl" onClick={handlePayment} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Place order"}
              </Button>
            </Card>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10 font-sans">
      <div className="border-b border-border bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-10 font-bold text-orange-500">
        <Button variant="ghost" onClick={onBack} className="gap-2"><ArrowLeft className="w-4 h-4" /> Continue shopping</Button>
        <span className="text-xl">FitConnect Cart</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 text-foreground">
        <Tabs defaultValue="cart" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-8">
            <TabsTrigger value="cart" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 gap-2 p-4 text-base">
              <ShoppingBag className="w-4 h-4" /> Cart ({cartItems.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 gap-2 p-4 text-base">
              <Clock className="w-4 h-4" /> Order history ({orderHistory.length})
            </TabsTrigger>
            <TabsTrigger value="payments" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 gap-2 p-4 text-base">
              <Banknote className="w-4 h-4" /> Payment history
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cart">
            {cartItems.length === 0 ? (
              <Card className="p-20 text-center flex flex-col items-center border-dashed border-2">
                <ShoppingBag className="w-20 h-20 mb-4 text-zinc-200" />
                <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
                <Button onClick={onBack} className="bg-orange-500 text-white mt-4">Shop now</Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map(item => (
                    <Card key={item.id} className="p-4 flex gap-4 hover:shadow-md transition-shadow">
                      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0"><ImageWithFallback src={item.image} className="w-full h-full object-cover" /></div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between">
                          <div><h4 className="font-bold text-lg">{item.name}</h4><p className="text-sm text-muted-foreground">{item.size || "Standard"}</p></div>
                          <Button variant="ghost" size="icon" onClick={() => onRemoveItem(item.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3 bg-zinc-50 p-1 rounded-lg">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}><Minus className="w-3 h-3" /></Button>
                            <span className="font-bold">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}><Plus className="w-3 h-3" /></Button>
                          </div>
                          <span className="font-bold text-lg text-orange-600">{(item.price * item.quantity).toLocaleString()}đ</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <Card className="p-6 space-y-6 h-fit sticky top-24 border-orange-100 bg-orange-50/20 shadow-sm">
                  <h3 className="font-bold text-xl">Payment summary</h3>
                  <div className="space-y-3 text-sm pt-4">
                    <div className="flex justify-between text-zinc-600"><span>Subtotal</span><span>{subtotal.toLocaleString()}đ</span></div>
                    <div className="flex justify-between text-zinc-600"><span>Shipping</span><span>{shipping.toLocaleString()}đ</span></div>
                    <Separator />
                    <div className="flex justify-between text-orange-600 font-bold text-xl"><span>Total</span><span>{total.toLocaleString()}đ</span></div>
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 font-bold rounded-xl shadow-lg" onClick={() => setCheckoutStep('checkout')}>Proceed to checkout</Button>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {loadingHistory ? (
              <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-orange-500" /></div>
            ) : orderHistory.length === 0 ? (
              <div className="text-center p-20 text-muted-foreground">You don't have any orders yet.</div>
            ) : (
              orderHistory.map((payment: any) => (
                <Card key={payment.id} className="p-6 border-zinc-200 hover:border-orange-200 transition-colors">
                  <div className="flex justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-lg text-zinc-800">Order ID: #ORD-{order.order.id}</span>
                      <span className="text-xs text-muted-foreground">Placed on: {new Date(order.order.orderDate || Date.now()).toLocaleDateString('en-US')}</span>
                    </div>
                    <Badge className={order.order.status === 'CANCELLED' ? "bg-red-500" : "bg-green-500"}>{order.order.status}</Badge>
                  </div>
                  <div className="flex gap-4 items-center border-t pt-4">
                    <div className="bg-orange-100 p-3 rounded-xl"><ShoppingBag className="w-6 h-6 text-orange-600" /></div>
                    <div className="flex-1">
                      <p className="font-medium">FitConnect order</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{order.order.shippingAddress}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600 text-lg">{order.order.totalPrice?.toLocaleString()}đ</div>
                      <p className="text-[10px] text-muted-foreground uppercase">{order.order.paymentMethod}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <PaymentHistoryList />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}