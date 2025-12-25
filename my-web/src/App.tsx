import React, { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { BookingFlow } from "./components/BookingFlow";
import { DesktopAbout } from "./components/DesktopAbout";
import { DesktopAdminDashboard } from "./components/DesktopAdminDashboard";
import { DesktopAgentAddGym } from "./components/DesktopAgentAddGym";
import { DesktopAgentAddProduct } from "./components/DesktopAgentAddProduct";
import { DesktopAgentDashboard } from "./components/DesktopAgentDashboard";
import { DesktopAgentGymDetail } from "./components/DesktopAgentGymDetail";
import { DesktopCart } from "./components/DesktopCart";
import { DesktopCustomerHome } from "./components/DesktopCustomerHome";
import { DesktopFeaturedTrainers } from "./components/DesktopFeaturedTrainers";
import { DesktopGymCenterDetail } from "./components/DesktopGymCenterDetail";
import { DesktopGymCenters } from "./components/DesktopGymCenters";
import { DesktopGymStoreDetail } from "./components/DesktopGymStoreDetail";
import { DesktopGymStores } from "./components/DesktopGymStores";
import { DesktopHeader } from "./components/DesktopHeader";
import { DesktopLogin } from "./components/DesktopLogin";
import { DesktopMarketplace } from "./components/DesktopMarketplace";
import { DesktopMyPT } from "./components/DesktopMyPT";
import { DesktopOrders } from "./components/DesktopOrders";
import { DesktopProductDetail } from "./components/DesktopProductDetail";
import { DesktopPTBookings } from "./components/DesktopPTBookings";
import { DesktopPTDashboardNew } from "./components/DesktopPTDashboardNew";
import { DesktopPTGymInfo } from "./components/DesktopPTGymInfo";
import { DesktopPTMessages } from "./components/DesktopPTMessages";
import { DesktopPTProfile } from "./components/DesktopPTProfile";
import { DesktopQuickBooking } from "./components/DesktopQuickBooking";
import { DesktopRefundPolicy } from "./components/DesktopRefundPolicy";
import { DesktopRegister } from "./components/DesktopRegister";
import { DesktopUIKit } from "./components/DesktopUIKit";
import { DesktopUserProfile } from "./components/DesktopUserProfile";
import { AuthProvider, useAuth } from "./context/AuthContext";

type Screen = "home" | "featured-trainers" | "gym-centers" | "gym-center-detail" | "profile" | "booking" | "gym-stores" | "gym-store-detail" | "marketplace" | "product-detail" | "cart" | "orders" | "about" | "user-profile" | "my-pt" | "agent-dashboard" | "agent-gym-detail" | "pt-dashboard" | "pt-bookings" | "pt-messages" | "pt-gym-info" | "refund-policy";
const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const MainApp = () => {
  const { user, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>("featured-trainers");

  if (!user) {
    return <Navigate to="/login" />;
  }
  const userType = user.role === 'TRAINEE' ? 'customer' : user.role === 'TRAINER' ? 'pt' : user.role === 'BUSINESS' ? 'agent' : user.role === 'ADMIN' ? 'admin' : 'customer';

  const [selectedTrainerId, setSelectedTrainerId] = useState<number | null>(null);
  const [bookingContext, setBookingContext] = useState<{
    trainerId: number;
    trainerName: string;
    packageId: number;
    price: number;
  } | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedGymId, setSelectedGymId] = useState<number | null>(null);
  const [selectedGymCenterId, setSelectedGymCenterId] = useState<number | null>(null);
  const [selectedAgentGymId, setSelectedAgentGymId] = useState<number | null>(null);
  const [showQuickBooking, setShowQuickBooking] = useState(false);
  const [showAddGym, setShowAddGym] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: any, quantity: number = 1, size: string = "M") => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity, size }];
    });
    alert("Đã thêm vào giỏ hàng!");
  };

  const handleUpdateCartQuantity = (id: any, newQty: number) => {
    if (newQty < 1) return;
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveFromCart = (id: any) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // CUSTOMER FLOW
  if (userType === "customer") {
    const headerProps = {
      userType: "Customer",
      onSwitchUser: logout,
      onNavigateHome: () => setCurrentScreen("featured-trainers"),
      onNavigateTrainers: () => setCurrentScreen("featured-trainers"),
      onNavigateMarketplace: () => {
        setCurrentScreen("marketplace"); // Chuyển từ "gym-stores" sang "marketplace"
        setSelectedProductId(null);    // Đảm bảo không bị kẹt ở trang chi tiết
        setSelectedGymId(null);         // Đảm bảo reset ID cửa hàng
      },
      onNavigateCart: () => setCurrentScreen("cart"),
      onNavigateOrders: () => setCurrentScreen("orders"),
      onNavigateAbout: () => setCurrentScreen("about"),
      onNavigateProfile: () => setCurrentScreen("user-profile"),
      onBookSession: () => setShowQuickBooking(true),
      onNavigateMyPT: () => setCurrentScreen("my-pt"),
    };

    if (currentScreen === "featured-trainers") {
      return (
        <div>
          <DesktopHeader {...headerProps} cartCount={cartCount} />
          <DesktopFeaturedTrainers
            onTrainerClick={(trainerId) => {
              setSelectedTrainerId(trainerId);
              setCurrentScreen("profile");
            }}
            onViewGyms={() => setCurrentScreen("gym-centers")}
            onShopProducts={() => setCurrentScreen("gym-stores")}
            onRefundPolicyClick={() => setCurrentScreen("refund-policy")}
            onProductClick={(productId) => {
              setSelectedProductId(String(productId));
              setCurrentScreen("product-detail");
            }}
          />
          <DesktopQuickBooking
            isOpen={showQuickBooking}
            onClose={() => setShowQuickBooking(false)}
            onSelectTrainer={(id) => {
              setSelectedTrainerId(id);
              setCurrentScreen("profile");
            }}
          />
        </div>
      );
    }

    if (currentScreen === "gym-centers") {
      return (
        <div>
          <DesktopHeader {...headerProps} cartCount={cartCount} />
          <DesktopGymCenters
            onBack={() => setCurrentScreen("featured-trainers")}
            onGymClick={(id) => { setSelectedGymCenterId(id); setCurrentScreen("gym-center-detail"); }}
          />
        </div>
      );
    }

    if (currentScreen === "gym-center-detail" && selectedGymCenterId) {
      return (
        <div>
          <DesktopHeader {...headerProps} cartCount={cartCount} />
          <DesktopGymCenterDetail
            gymId={selectedGymCenterId}
            onBack={() => { setCurrentScreen("gym-centers"); setSelectedGymCenterId(null); }}
            onTrainerClick={(id) => { setSelectedTrainerId(id); setCurrentScreen("profile"); }}
          />
        </div>
      );
    }

    if (currentScreen === "my-pt") {
      return (
        <div>
          <DesktopHeader {...headerProps} cartCount={cartCount} />
          <DesktopMyPT
            onBack={() => setCurrentScreen("featured-trainers")}
            onTrainerSelect={(id) => { setSelectedTrainerId(id); setCurrentScreen("profile"); }}
            onBookSession={(id) => { setSelectedTrainerId(id); setCurrentScreen("booking"); }}
          />
        </div>
      );
    }

    if (currentScreen === "booking") {
      return (
        <div>
          <DesktopHeader {...headerProps} cartCount={cartCount} />
          <BookingFlow
            bookingContext={bookingContext!}
            onBack={() => setCurrentScreen("profile")}
          />
        </div>
      );
    }

    if (currentScreen === "profile" && selectedTrainerId) {
      return (
        <div>
          <DesktopHeader {...headerProps} cartCount={cartCount} />
          <DesktopPTProfile
            trainerId={selectedTrainerId}

            onBack={() => {
              if (selectedGymCenterId) {
                setCurrentScreen("gym-center-detail");
              } else {
                setCurrentScreen("featured-trainers");
              }
              setSelectedTrainerId(null);
            }}
            onBooking={(data) => {
              setBookingContext(data);
              setCurrentScreen("booking");
            }}
          />
        </div>
      );
    }

    if (currentScreen === "gym-stores") {
      return (
        <div>
          <DesktopHeader {...headerProps} cartCount={cartCount} />
          <DesktopGymStores
            onBack={() => setCurrentScreen("featured-trainers")}
            onGymClick={(id) => { setSelectedGymId(id); setCurrentScreen("gym-store-detail"); }}
          />
        </div>
      );
    }

    if (currentScreen === "gym-store-detail" && selectedGymId) {
      return (
        <div>
          <DesktopHeader {...headerProps} cartCount={cartCount} />
          <DesktopGymStoreDetail
            gymId={selectedGymId}
            onBack={() => {
              setCurrentScreen("gym-stores");
              setSelectedGymId(null);
            }}
            onProductClick={(productId) => {
              setSelectedProductId(productId);
              setCurrentScreen("product-detail");
            }}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
          />
        </div>
      );
    }

    if (currentScreen === "marketplace") {
      return (
        <div>
          <DesktopHeader {...headerProps} cartCount={cartCount} />
          <DesktopMarketplace
            onBack={() => setCurrentScreen("featured-trainers")}
            onProductClick={(id) => { setSelectedProductId(id); setCurrentScreen("product-detail"); }}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
          />
        </div>
      );
    }

    if (currentScreen === "product-detail" && selectedProductId) {
      return (
        <div>
          <DesktopHeader {...headerProps} cartCount={cartCount} />
          <DesktopProductDetail
            productId={selectedProductId}
            onBack={() => {
              if (selectedGymId) {
                setCurrentScreen("gym-store-detail");
              } else {
                setCurrentScreen("marketplace");
              }
            }}
            onAddToCart={(product, qty, size) => handleAddToCart(product, qty, size)} />
        </div>
      );
    }

    if (currentScreen === "cart") {
      return (
        <div>
          <DesktopHeader {...headerProps} cartCount={cartCount} />
          <DesktopCart
            cartItems={cartItems}
            onBack={() => setCurrentScreen("gym-stores")}
            onCheckout={() => { /* Logic sau khi thanh toán xong */ }}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={() => setCartItems([])}
          />
        </div>
      );
    }

    if (currentScreen === "orders") {
      return (
        <div>
          <DesktopHeader {...headerProps} cartCount={cartCount} />
          <DesktopOrders onBack={() => setCurrentScreen("featured-trainers")} />
        </div>
      );
    }

    if (currentScreen === "about") {
      return (
        <div>
          <DesktopHeader {...headerProps} cartCount={cartCount} />
          <DesktopAbout onBack={() => setCurrentScreen("featured-trainers")} />
        </div>
      );
    }

    if (currentScreen === "refund-policy") {
      return (
        <div>
          <DesktopHeader {...headerProps} cartCount={cartCount} />
          <DesktopRefundPolicy onBack={() => setCurrentScreen("featured-trainers")} />
        </div>
      );
    }

    if (currentScreen === "user-profile") {
      return (
        <div>
          <DesktopHeader {...headerProps} cartCount={cartCount} />
          <DesktopUserProfile
            onBack={() => setCurrentScreen("featured-trainers")}
            userType="Customer"
            onLogout={logout}
          />
        </div>
      );
    }




    return (
      <div>
        <DesktopHeader {...headerProps} cartCount={cartCount} />
        <DesktopCustomerHome
          onTrainerSelect={() => setCurrentScreen("featured-trainers")}
          onMarketplaceClick={() => setCurrentScreen("gym-stores")}
        />
        <DesktopQuickBooking isOpen={showQuickBooking} onClose={() => setShowQuickBooking(false)} onSelectTrainer={(id) => { setSelectedTrainerId(id); setCurrentScreen("profile"); }} />
      </div>
    );
  }

  // PT FLOW
  if (userType === "pt") {
    if (currentScreen === "pt-bookings") {
      return (
        <DesktopPTBookings
          onBack={() => setCurrentScreen("pt-dashboard")}
          onMessageClient={(clientName) => {
            setCurrentScreen("pt-messages");
          }}
        />
      );
    }

    if (currentScreen === "pt-messages") {
      return (
        <DesktopPTMessages
          onBack={() => setCurrentScreen("pt-dashboard")}
        />
      );
    }

    if (currentScreen === "pt-gym-info") {
      return (
        <DesktopPTGymInfo
          onBack={() => setCurrentScreen("pt-dashboard")}
        />
      );
    }

    return (
      <DesktopPTDashboardNew
        onViewBookings={() => setCurrentScreen("pt-bookings")}
        onViewMessages={() => setCurrentScreen("pt-messages")}
        onViewGym={() => setCurrentScreen("pt-gym-info")}
      />
    );
  }

  // AGENT FLOW
  if (userType === "agent") {
    if (currentScreen === "agent-gym-detail" && selectedAgentGymId) {
      return (
        <div>
          <DesktopHeader userType="Agent" onSwitchUser={logout} />
          <DesktopAgentGymDetail
            gymId={selectedAgentGymId}
            onBack={() => { setCurrentScreen("agent-dashboard"); setSelectedAgentGymId(null); }}
            onAddProduct={() => setShowAddProduct(true)}
          />
          <DesktopAgentAddProduct isOpen={showAddProduct} onClose={() => setShowAddProduct(false)} onSubmit={() => setShowAddProduct(false)} />
        </div>
      );
    }
    return (
      <div>
        <DesktopHeader userType="Agent" onSwitchUser={logout} />
        <DesktopAgentDashboard
          onAddGym={() => setShowAddGym(true)}
          onGymClick={(id) => { setSelectedAgentGymId(id); setCurrentScreen("agent-gym-detail"); }}
        />
        <DesktopAgentAddGym isOpen={showAddGym} onClose={() => setShowAddGym(false)} onSubmit={() => setShowAddGym(false)} />
      </div>
    );
  }

  // ADMIN FLOW
  if (userType === "admin") {
    const adminHeaderProps = {
      userType: "Admin",
      onSwitchUser: logout,
      onNavigateProfile: () => setCurrentScreen("user-profile"),
      onNavigateHome: () => setCurrentScreen("featured-trainers"),
    };

    if (currentScreen === "user-profile") {
      return (
        <div>
          <DesktopHeader {...adminHeaderProps} />
          <DesktopUserProfile
            onBack={() => setCurrentScreen("featured-trainers")}
            userType="Admin"
            onLogout={logout}
          />
        </div>
      );
    }

    return (
      <div>
        <DesktopHeader {...adminHeaderProps} />
        <DesktopAdminDashboard />
      </div>
    );
  }

  return <div>Unknown Role</div>;
};

const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" /> : children;
};

const RootRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/login" element={<PublicRoute><DesktopLogin /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><DesktopRegister /></PublicRoute>} />
          <Route path="/ui-kit" element={<DesktopUIKit onBack={() => window.location.href = '/login'} />} />

          {/* Mọi route khác đều vào MainApp và được bảo vệ */}
          <Route path="/home" element={<PrivateRoute><MainApp /></PrivateRoute>} />
          <Route path="/*" element={<RootRoute />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
