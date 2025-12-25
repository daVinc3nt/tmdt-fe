import { useState } from "react";
import { X, Upload, MapPin, Building2, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface DesktopAgentAddGymProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (gymData: any) => void;
}

export function DesktopAgentAddGym({ isOpen, onClose, onSubmit }: DesktopAgentAddGymProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    image: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      location: "",
      description: "",
      address: "",
      phone: "",
      email: "",
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
            <h2 className="text-foreground mb-1">Add New Gym Center</h2>
            <p className="text-muted-foreground text-sm">Fill in the details to list your gym on the marketplace</p>
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
            {/* Gym Name */}
            <div>
              <label className="block text-foreground text-sm mb-2">
                Gym Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="e.g., PowerFit Training Center"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 bg-background border-border"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-foreground text-sm mb-2">
                City, State *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="e.g., New York, NY"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="pl-10 bg-background border-border"
                  required
                />
              </div>
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-foreground text-sm mb-2">
                Full Address *
              </label>
              <Input
                type="text"
                placeholder="Street address, suite/unit number"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-background border-border"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-foreground text-sm mb-2">
                Description *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Textarea
                  placeholder="Describe your gym, facilities, and what makes it special..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="pl-10 bg-background border-border min-h-[120px]"
                  required
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground text-sm mb-2">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-background border-border"
                  required
                />
              </div>
              <div>
                <label className="block text-foreground text-sm mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  placeholder="gym@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background border-border"
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-foreground text-sm mb-2">
                Gym Photo URL
              </label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="https://example.com/gym-photo.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="pl-10 bg-background border-border"
                />
              </div>
              <p className="text-muted-foreground text-xs mt-2">
                Provide a URL to your gym's main photo. This will be displayed on the marketplace.
              </p>
            </div>
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
              Add Gym Center
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
