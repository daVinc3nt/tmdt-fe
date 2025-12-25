import { useState } from "react";
import { X, Upload, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ReturnRequestModalProps {
  order: any;
  onClose: () => void;
  onSubmit: (returnData: any) => void;
}

export function DesktopReturnRequestModal({ order, onClose, onSubmit }: ReturnRequestModalProps) {
  const [returnReason, setReturnReason] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  const returnReasons = [
    "Defective or damaged",
    "Wrong item received",
    "Size not suitable",
    "Quality not as expected",
    "Changed my mind",
    "Product not as described",
    "Other"
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Mock upload - in real app would upload to server
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  const handleSubmit = () => {
    if (!returnReason || !description || !agreedToPolicy) {
      alert("Please fill all required fields and agree to the policy");
      return;
    }

    onSubmit({
      orderId: order.id,
      reason: returnReason,
      description,
      images: uploadedImages,
      submittedDate: new Date().toLocaleDateString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[20px] bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between rounded-t-[20px]">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-6 h-6 text-primary" />
            <h2 className="text-foreground">Request Return</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <Card className="rounded-[12px] border-border p-4 bg-secondary/30">
            <h3 className="text-foreground text-sm mb-3">Order Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="text-foreground">{order.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="text-foreground">{order.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivered Date:</span>
                <span className="text-foreground">{order.deliveredDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="text-foreground">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Items in Order */}
          <div>
            <h3 className="text-foreground mb-3">Items to Return</h3>
            <div className="space-y-3">
              {order.items.map((item: any, idx: number) => (
                <Card key={idx} className="rounded-[12px] border-border p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-[8px] overflow-hidden bg-secondary flex-shrink-0">
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
                </Card>
              ))}
            </div>
          </div>

          {/* Return Reason */}
          <div>
            <label className="text-foreground mb-2 block">
              Reason for Return <span className="text-red-500">*</span>
            </label>
            <Select value={returnReason} onValueChange={setReturnReason}>
              <SelectTrigger className="border-border rounded-[12px]">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {returnReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <label className="text-foreground mb-2 block">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Please provide details about the issue or reason for return..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] border-border rounded-[12px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum 20 characters required
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="text-foreground mb-2 block">
              Upload Photos (Optional but recommended)
            </label>
            <div className="border-2 border-dashed border-border rounded-[12px] p-6 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                Upload photos of the product condition
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>Choose Files</span>
                </Button>
              </label>
            </div>
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-3">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-[8px]"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 p-0"
                      onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Policy Notice */}
          <Card className="rounded-[12px] border-yellow-200 bg-yellow-50 p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm text-yellow-800">
                <p className="font-medium">Return Policy Reminders:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Items must be unused and in original condition</li>
                  <li>Opened supplements cannot be returned (unless defective)</li>
                  <li>Return shipping cost paid by customer (unless defective)</li>
                  <li>Refund processed within 5-7 days after item inspection</li>
                  <li>15% restocking fee may apply for opened equipment</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agree-policy"
              checked={agreedToPolicy}
              onChange={(e) => setAgreedToPolicy(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="agree-policy" className="text-sm text-muted-foreground">
              I have read and agree to the return policy. I understand that my return request will be
              reviewed by an admin and may be approved or rejected based on the policy conditions.
              <span className="text-red-500"> *</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary text-white"
              onClick={handleSubmit}
              disabled={!returnReason || !description || !agreedToPolicy || description.length < 20}
            >
              Submit Return Request
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
