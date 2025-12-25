import { ArrowLeft, Package, Truck, CheckCircle, RotateCcw, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DesktopOrdersProps {
  onBack: () => void;
}

export function DesktopOrders({ onBack }: DesktopOrdersProps) {
  const orders = {
    inTransit: [
      {
        id: "ORD-2024-1234",
        date: "Nov 1, 2024",
        status: "In Transit",
        estimatedDelivery: "Nov 8, 2024",
        items: [
          {
            name: "Premium Resistance Bands Set",
            quantity: 2,
            price: 49.99,
            image: "https://images.unsplash.com/photo-1626143955141-e3016ac1fbdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXF1aXBtZW50JTIwcHJvZHVjdHxlbnwxfHx8fDE3NjIyNTQ2ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
          },
        ],
        total: 99.98,
        trackingNumber: "TRK123456789",
      },
      {
        id: "ORD-2024-1235",
        date: "Nov 2, 2024",
        status: "Processing",
        estimatedDelivery: "Nov 10, 2024",
        items: [
          {
            name: "Protein Powder - Chocolate",
            quantity: 1,
            price: 39.99,
            image: "https://images.unsplash.com/photo-1709976142411-26dfc86b13fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBzdXBwbGVtZW50cyUyMG51dHJpdGlvbnxlbnwxfHx8fDE3NjIyNTQ2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
          },
        ],
        total: 39.99,
        trackingNumber: null,
      },
    ],
    delivered: [
      {
        id: "ORD-2024-1220",
        date: "Oct 25, 2024",
        deliveredDate: "Oct 30, 2024",
        status: "Delivered",
        items: [
          {
            name: "Yoga Mat - Premium",
            quantity: 1,
            price: 29.99,
            image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
          },
          {
            name: "Water Bottle - 1L",
            quantity: 2,
            price: 15.99,
            image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
          },
        ],
        total: 61.97,
      },
      {
        id: "ORD-2024-1215",
        date: "Oct 20, 2024",
        deliveredDate: "Oct 24, 2024",
        status: "Delivered",
        items: [
          {
            name: "Dumbbells Set - 10kg",
            quantity: 1,
            price: 89.99,
            image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
          },
        ],
        total: 89.99,
      },
    ],
    returns: [
      {
        id: "RET-2024-0045",
        originalOrderId: "ORD-2024-1200",
        date: "Oct 15, 2024",
        returnDate: "Oct 18, 2024",
        status: "Refund Processed",
        reason: "Size not suitable",
        items: [
          {
            name: "Compression Shorts",
            quantity: 1,
            price: 34.99,
            image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
          },
        ],
        refundAmount: 34.99,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-foreground mb-6">My Orders</h1>

        <Tabs defaultValue="in-transit" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
            <TabsTrigger
              value="in-transit"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary gap-2"
            >
              <Truck className="w-4 h-4" />
              In Transit ({orders.inTransit.length})
            </TabsTrigger>
            <TabsTrigger
              value="delivered"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Delivered ({orders.delivered.length})
            </TabsTrigger>
            <TabsTrigger
              value="returns"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Returns ({orders.returns.length})
            </TabsTrigger>
          </TabsList>

          {/* In Transit Orders */}
          <TabsContent value="in-transit" className="space-y-4">
            {orders.inTransit.map((order) => (
              <Card key={order.id} className="rounded-[20px] border-border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-foreground mb-1">Order {order.id}</h3>
                    <p className="text-muted-foreground text-sm">Placed on {order.date}</p>
                  </div>
                  <Badge className={order.status === "In Transit" ? "bg-blue-500 text-white" : "bg-yellow-500 text-white"}>
                    {order.status}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-20 h-20 rounded-[12px] overflow-hidden bg-secondary flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-foreground">{item.name}</h4>
                        <p className="text-muted-foreground text-sm">Quantity: {item.quantity}</p>
                        <p className="text-foreground">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div>
                    <p className="text-muted-foreground text-sm">Estimated Delivery</p>
                    <p className="text-foreground">{order.estimatedDelivery}</p>
                    {order.trackingNumber && (
                      <p className="text-muted-foreground text-xs mt-1">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-sm">Total</p>
                    <p className="text-foreground text-xl">${order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Track Order
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    Contact Support
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Delivered Orders */}
          <TabsContent value="delivered" className="space-y-4">
            {orders.delivered.map((order) => (
              <Card key={order.id} className="rounded-[20px] border-border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-foreground mb-1">Order {order.id}</h3>
                    <p className="text-muted-foreground text-sm">Placed on {order.date}</p>
                    <p className="text-green-600 text-sm">Delivered on {order.deliveredDate}</p>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {order.status}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-20 h-20 rounded-[12px] overflow-hidden bg-secondary flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-foreground">{item.name}</h4>
                        <p className="text-muted-foreground text-sm">Quantity: {item.quantity}</p>
                        <p className="text-foreground">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="text-right ml-auto">
                    <p className="text-muted-foreground text-sm">Total</p>
                    <p className="text-foreground text-xl">${order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1" size="sm">
                    Buy Again
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    Write Review
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Return
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Returns */}
          <TabsContent value="returns" className="space-y-4">
            {orders.returns.map((returnItem) => (
              <Card key={returnItem.id} className="rounded-[20px] border-border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-foreground mb-1">Return {returnItem.id}</h3>
                    <p className="text-muted-foreground text-sm">
                      Original Order: {returnItem.originalOrderId}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Return Date: {returnItem.returnDate}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Reason: {returnItem.reason}
                    </p>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    {returnItem.status}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  {returnItem.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-20 h-20 rounded-[12px] overflow-hidden bg-secondary flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-foreground">{item.name}</h4>
                        <p className="text-muted-foreground text-sm">Quantity: {item.quantity}</p>
                        <p className="text-foreground">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="text-right ml-auto">
                    <p className="text-muted-foreground text-sm">Refund Amount</p>
                    <p className="text-green-600 text-xl">${returnItem.refundAmount.toFixed(2)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
