import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Truck, CheckCircle, RotateCcw, MapPin, Banknote, QrCode, Loader2, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { type UserAPI } from "../services/ptService"; 
import { useAuth } from "../context/AuthContext"; 
import orderService from "../services/orderService"; 

interface DesktopCartProps {
  cartItems: any[]; 
  onBack: () => void;
  onCheckout: () => void;
  onUpdateQuantity: (id: any, newQuantity: number) => void;
  onRemoveItem: (id: any) => void;
  onClearCart: () => void;
}

export function DesktopCart({ cartItems, onBack, onCheckout, onUpdateQuantity, onRemoveItem, onClearCart }: DesktopCartProps) {
  // FIX: Ép kiểu linh hoạt để lấy ID từ AuthContext
  const { user } = useAuth() as { user: any | null };
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout'>('cart');
  const [isQRPage, setIsQRPage] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({ fullName: "", phone: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'banking'>('cod');
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // --- FETCH LỊCH SỬ ĐƠN HÀNG ---
  useEffect(() => {
    const fetchOrderHistory = async () => {
      // Đảm bảo user.id tồn tại (đã được giải mã từ token)
      if (!user?.id) return; 
      try {
        setLoadingHistory(true);
        const response = await orderService.getOrdersByUserId(user.id);
        const data = (response as any).data || response;
        setOrderHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi lấy lịch sử đơn hàng:", error);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchOrderHistory();
  }, [user?.id, checkoutStep]);

  // --- TIMER ĐẾM NGƯỢC ---
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

  // --- CHI PHÍ ---
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedPromo === "SAVE10" ? subtotal * 0.1 : 0;
  const shipping = subtotal > 1000000 ? 0 : 30000;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  // --- HÀM GỬI ĐƠN HÀNG LÊN API ---
  const handlePayment = async () => {
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
        alert("Vui lòng nhập đầy đủ thông tin giao hàng!"); return;
    }
    
    if (!user?.id) {
        alert("Không tìm thấy thông tin đăng nhập hợp lệ. Vui lòng đăng nhập lại!"); return;
    }

    setIsLoading(true);
    try {
      const orderRequest = {
        userId: user.id,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        shippingAddress: `${shippingInfo.fullName} | ${shippingInfo.phone} | ${shippingInfo.address}`,
        paymentMethod: paymentMethod.toUpperCase()
      };

      await orderService.createOrder(orderRequest as any);

      if (paymentMethod === 'banking') {
        setIsQRPage(true); 
      } else {
        alert("Đặt hàng thành công!");
        completeOrder();
      }
    } catch (error: any) {
      // Xử lý lỗi 403 Forbidden từ Backend
      if (error.response?.status === 403) {
        alert("Lỗi bảo mật (403): Token hết hạn hoặc không có quyền. Vui lòng đăng nhập lại!");
      } else {
        alert("Hệ thống bận, vui lòng thử lại sau!");
      }
      console.error("Lỗi đặt hàng API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOrder = () => {
    onClearCart();
    setCheckoutStep('cart');
    setIsQRPage(false);
    onCheckout();
  };

  // PHẦN RENDER DƯỚI ĐÂY GIỮ NGUYÊN 100% NHƯ BẠN YÊU CẦU
  if (isQRPage) {
    return (
      <div className="fixed inset-0 bg-zinc-100 z-[100] flex items-center justify-center animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-4xl h-[620px] shadow-2xl rounded-2xl overflow-hidden flex font-sans">
          <div className="w-[35%] bg-[#A50064] p-8 text-white flex flex-col justify-between">
            <div className="space-y-10">
              <div>
                <p className="text-sm opacity-80 mb-1 flex items-center gap-2"><Clock className="w-4 h-4"/> Đơn hàng hết hạn sau</p>
                <p className="text-4xl font-mono font-bold tracking-wider">{formatTimer(timeLeft)}</p>
              </div>
              <div className="space-y-6 text-sm">
                <div><p className="opacity-60 mb-1 uppercase text-[10px] tracking-widest">Nhà cung cấp</p><p className="font-bold text-lg">FITCONNECT STORE</p></div>
                <div><p className="opacity-60 mb-1 uppercase text-[10px] tracking-widest">Số tiền</p><p className="font-bold text-2xl">{total.toLocaleString()}đ</p></div>
                <div><p className="opacity-60 mb-1 uppercase text-[10px] tracking-widest">Thông tin</p><p className="leading-relaxed font-medium text-xs">Thanh toán FitConnect cho {shippingInfo.fullName}</p></div>
              </div>
            </div>
            <Button variant="ghost" className="text-white hover:bg-white/10 self-start gap-2" onClick={() => setIsQRPage(false)}>
              <ArrowLeft className="w-4 h-4"/> Quay lại
            </Button>
          </div>
          <div className="flex-1 p-12 flex flex-col items-center justify-center bg-white relative text-foreground">
            <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="h-12 w-12 object-contain mb-2" />
            <h2 className="text-xl font-bold mb-8 text-zinc-800">Quét mã MoMo để thanh toán</h2>
            <div className="p-4 border-2 border-zinc-100 rounded-2xl bg-white shadow-lg mb-6">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=FitConnect_Payment_${total}`} alt="QR" className="w-48 h-48" />
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-500 mb-8">
                <Loader2 className="w-4 h-4 animate-spin text-[#A50064]" /> <p>Đang chờ hệ thống xác nhận...</p>
            </div>
            <Button className="w-full bg-[#A50064] hover:bg-[#820050] text-white py-7 rounded-xl font-bold text-lg" onClick={completeOrder}>
                Xác nhận đã chuyển khoản
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
            <Button variant="ghost" onClick={() => setCheckoutStep('cart')} className="gap-2"><ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng</Button>
            <span className="text-xl">Thanh toán đơn hàng</span>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 border-border">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-orange-600"><MapPin className="w-5 h-5"/> Thông tin giao nhận</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2"><Label>Họ tên người nhận</Label><Input value={shippingInfo.fullName} onChange={e => setShippingInfo({...shippingInfo, fullName: e.target.value})} className="border-orange-200" placeholder="Nguyễn Văn A" /></div>
                  <div className="space-y-2"><Label>Số điện thoại</Label><Input value={shippingInfo.phone} onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})} className="border-orange-200" placeholder="0909xxxxxx" /></div>
                  <div className="col-span-2 space-y-2"><Label>Địa chỉ chi tiết</Label><Input value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})} className="border-orange-200" placeholder="Số nhà, Tên đường, Phường/Xã..." /></div>
                </div>
              </Card>
              <Card className="p-6 border-border text-foreground">
                <h2 className="text-lg font-semibold mb-6">Hình thức thanh toán</h2>
                <div className="space-y-3">
                  <div className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-zinc-200'}`} onClick={() => setPaymentMethod('cod')}>
                    <Banknote className="w-6 h-6 text-green-600"/> <div><p className="font-bold">COD</p><p className="text-xs text-muted-foreground">Thanh toán khi nhận hàng</p></div>
                  </div>
                  <div className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'banking' ? 'border-orange-500 bg-orange-50' : 'border-zinc-200'}`} onClick={() => setPaymentMethod('banking')}>
                    <QrCode className="w-6 h-6 text-[#A50064]"/> <div><p className="font-bold">Momo QR</p><p className="text-xs text-muted-foreground">Chuyển khoản qua ví điện tử MoMo</p></div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 border-border h-fit sticky top-24 shadow-sm bg-zinc-50/50">
              <h3 className="font-bold text-lg mb-4 text-orange-600">Tổng hóa đơn</h3>
              <div className="space-y-3 text-sm mb-6 text-foreground">
                <div className="flex justify-between"><span>Tạm tính ({cartItems.length} món)</span><span>{subtotal.toLocaleString()}đ</span></div>
                <div className="flex justify-between"><span>Vận chuyển</span><span>{shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString()}đ`}</span></div>
                <div className="flex justify-between"><span>Thuế VAT (8%)</span><span>{tax.toLocaleString()}đ</span></div>
                {appliedPromo && <div className="flex justify-between text-green-600"><span>Giảm giá</span><span>-{discount.toLocaleString()}đ</span></div>}
                <Separator />
                <div className="flex justify-between font-bold text-xl text-orange-600"><span>Thành tiền</span><span>{total.toLocaleString()}đ</span></div>
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg font-bold rounded-xl" onClick={handlePayment} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin"/> : "Đặt hàng ngay"}
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
        <Button variant="ghost" onClick={onBack} className="gap-2"><ArrowLeft className="w-4 h-4" /> Tiếp tục mua sắm</Button>
        <span className="text-xl">Giỏ hàng FitConnect</span>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8 text-foreground">
        <Tabs defaultValue="cart" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-8">
            <TabsTrigger value="cart" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 gap-2 p-4 text-base">
              <ShoppingBag className="w-4 h-4" /> Giỏ hàng ({cartItems.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 gap-2 p-4 text-base">
              <Clock className="w-4 h-4" /> Lịch sử đơn hàng ({orderHistory.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cart">
            {cartItems.length === 0 ? (
              <Card className="p-20 text-center flex flex-col items-center border-dashed border-2">
                <ShoppingBag className="w-20 h-20 mb-4 text-zinc-200" />
                <h3 className="text-xl font-bold mb-2">Giỏ hàng đang trống</h3>
                <Button onClick={onBack} className="bg-orange-500 text-white mt-4">Mua sắm ngay</Button>
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
                            <Button variant="ghost" size="icon" onClick={() => onRemoveItem(item.id)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
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
                  <h3 className="font-bold text-xl">Tóm tắt thanh toán</h3>
                  <div className="space-y-3 text-sm pt-4">
                      <div className="flex justify-between text-zinc-600"><span>Tổng giá trị</span><span>{subtotal.toLocaleString()}đ</span></div>
                      <div className="flex justify-between text-zinc-600"><span>Phí ship</span><span>{shipping.toLocaleString()}đ</span></div>
                      <Separator />
                      <div className="flex justify-between text-orange-600 font-bold text-xl"><span>Tổng cộng</span><span>{total.toLocaleString()}đ</span></div>
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 font-bold rounded-xl shadow-lg" onClick={() => setCheckoutStep('checkout')}>Tiến hành đặt hàng</Button>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {loadingHistory ? (
               <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-orange-500" /></div>
            ) : orderHistory.length === 0 ? (
               <div className="text-center p-20 text-muted-foreground">Bạn chưa có đơn hàng nào.</div>
            ) : (
              orderHistory.map((order: any) => (
                <Card key={order.id} className="p-6 border-zinc-200 hover:border-orange-200 transition-colors">
                  <div className="flex justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-lg text-zinc-800">Mã đơn: #ORD-{order.id}</span>
                      <span className="text-xs text-muted-foreground">Đặt ngày: {new Date(order.orderDate || Date.now()).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <Badge className={order.status === 'CANCELLED' ? "bg-red-500" : "bg-green-500"}>{order.status}</Badge>
                  </div>
                  <div className="flex gap-4 items-center border-t pt-4">
                    <div className="bg-orange-100 p-3 rounded-xl"><ShoppingBag className="w-6 h-6 text-orange-600"/></div>
                    <div className="flex-1">
                        <p className="font-medium">Đơn hàng FitConnect</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{order.shippingAddress}</p>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-orange-600 text-lg">{order.totalAmount?.toLocaleString()}đ</div>
                        <p className="text-[10px] text-muted-foreground uppercase">{order.paymentMethod}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}