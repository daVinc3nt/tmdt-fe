import { useState } from "react";
import { X, Upload, Package, DollarSign, Hash } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DesktopAgentAddProductProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: any) => void;
}

export function DesktopAgentAddProduct({ isOpen, onClose, onSubmit }: DesktopAgentAddProductProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    image: ""
  });

  const categories = [
    "Supplements",
    "Equipment",
    "Accessories",
    "Apparel",
    "Nutrition",
    "Recovery"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    });
    setFormData({
      name: "",
      category: "",
      description: "",
      price: "",
      stock: "",
      image: ""
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-border bg-card">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-foreground mb-1">Add New Product</h2>
            <p className="text-muted-foreground text-sm">List a new product to your gym's marketplace</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-foreground text-sm mb-2">
                Product Name *
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="e.g., Premium Protein Powder"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 bg-background border-border"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-foreground text-sm mb-2">
                Category *
              </label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-foreground text-sm mb-2">
                Description *
              </label>
              <Textarea
                placeholder="Describe your product, its features and benefits..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-background border-border min-h-[120px]"
                required
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground text-sm mb-2">
                  Price (USD) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="29.99"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="pl-10 bg-background border-border"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground text-sm mb-2">
                  Stock Quantity *
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="number"
                    min="0"
                    placeholder="100"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="pl-10 bg-background border-border"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-foreground text-sm mb-2">
                Product Image URL *
              </label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="https://example.com/product-image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="pl-10 bg-background border-border"
                  required
                />
              </div>
              <p className="text-muted-foreground text-xs mt-2">
                Provide a URL to your product's image. This will be displayed on the marketplace.
              </p>
            </div>

            {/* Preview */}
            {formData.image && (
              <div>
                <label className="block text-foreground text-sm mb-2">
                  Image Preview
                </label>
                <div className="rounded-[12px] overflow-hidden h-48 bg-muted">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-white"
            >
              Add Product
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
