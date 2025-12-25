import { ArrowLeft, Mail, Phone, MapPin, Calendar, Edit, Camera, Save, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { userService, type UserProfile, type UserUpdateData } from "../services/userService";

interface DesktopUserProfileProps {
  onBack: () => void;
  userType?: string;
  onLogout?: () => void;
}

export function DesktopUserProfile({ onBack, userType = "Customer", onLogout }: DesktopUserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserUpdateData>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getCurrentUser();
      setProfileData(data);
      setFormData({
        fullName: data.fullName || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender,
        goal: data.goal || '',
        height: data.height || '',
        weight: data.weight || '',
        bio: data.bio || '',
        specialty: data.specialty || '',
        experienceYear: data.experienceYear,
        certificate: data.certificate || '',
        address: data.address || '',
        taxCode: data.taxCode || '',
        businessName: data.businessName || '',
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await userService.updateCurrentUser(formData);
      setProfileData(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getRoleDisplay = (role?: string) => {
    if (!role) return userType;
    if (role === "TRAINER") return "Personal Trainer";
    if (role === "TRAINEE") return "Trainee";
    if (role === "BUSINESS") return "Business";
    if (role === "ADMIN") return "Admin";
    return role;
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Failed to load profile</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-6">
            <Card className="rounded-[20px] border-border p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl">{getInitials(profileData.fullName)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full w-10 h-10 bg-primary text-white"
                    >
                      <Camera className="w-5 h-5" />
                    </Button>
                  )}
                </div>
                <h2 className="text-foreground mb-1">{profileData.fullName || "User"}</h2>
                <p className="text-muted-foreground mb-2">{getRoleDisplay(profileData.role)}</p>
                <Badge className="bg-primary text-white">Active Member</Badge>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {profileData.email || "N/A"}
                </div>
                {profileData.phoneNumber && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {profileData.phoneNumber}
                  </div>
                )}
                {profileData.address && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {profileData.address}
                  </div>
                )}
                {profileData.dateOfBirth && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(profileData.dateOfBirth)}
                  </div>
                )}
              </div>
            </Card>

            <Button 
              variant="outline" 
              className="w-full h-12 rounded-[20px] border-2 border-border hover:border-destructive hover:text-destructive hover:bg-destructive/10 transition-colors gap-2"
              onClick={onLogout || onBack}
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>

          <div className="col-span-2">
            <Card className="rounded-[20px] border-border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-foreground">Profile Information</h2>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      loadProfile();
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-primary text-white gap-2" disabled={saving}>
                      <Save className="w-4 h-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </div>

              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
                  <TabsTrigger
                    value="personal"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    Personal Info
                  </TabsTrigger>
                  {(profileData.role === "TRAINEE" || profileData.role === "TRAINER") && (
                    <TabsTrigger
                      value="fitness"
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                    >
                      {profileData.role === "TRAINER" ? "Professional Info" : "Fitness Profile"}
                    </TabsTrigger>
                  )}
                  {profileData.role === "BUSINESS" && (
                    <TabsTrigger
                      value="business"
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                    >
                      Business Info
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={formData.fullName || ''}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        disabled={!isEditing}
                        className="border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={formData.phoneNumber || ''}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        disabled={!isEditing}
                        className="border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth || ''}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        disabled={!isEditing}
                        className="border-border"
                      />
                    </div>
                    {(profileData.role === "TRAINEE" || profileData.role === "TRAINER") && (
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <select
                          value={formData.gender || ''}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'MALE' | 'FEMALE' })}
                          disabled={!isEditing}
                          className="w-full h-10 rounded-md border border-border bg-background px-3"
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                        </select>
                      </div>
                    )}
                    {profileData.role === "BUSINESS" && (
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input
                          value={formData.address || ''}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          disabled={!isEditing}
                          className="border-border"
                        />
                      </div>
                    )}
                    {(profileData.role === "TRAINEE" || profileData.role === "TRAINER") && (
                      <div className="space-y-2 col-span-2">
                        <Label>Bio</Label>
                        <Textarea
                          value={formData.bio || ''}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          disabled={!isEditing}
                          rows={4}
                          className="border-border resize-none"
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                {(profileData.role === "TRAINEE" || profileData.role === "TRAINER") && (
                  <TabsContent value="fitness" className="space-y-4">
                    {profileData.role === "TRAINEE" ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Fitness Goals</Label>
                          <Input
                            value={formData.goal || ''}
                            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                            disabled={!isEditing}
                            className="border-border"
                            placeholder="e.g., Build muscle, Lose weight"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Height (cm)</Label>
                            <Input
                              type="number"
                              value={formData.height || ''}
                              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                              disabled={!isEditing}
                              className="border-border"
                              placeholder="175"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Weight (kg)</Label>
                            <Input
                              type="number"
                              value={formData.weight || ''}
                              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                              disabled={!isEditing}
                              className="border-border"
                              placeholder="70"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Specialty</Label>
                          <Input
                            value={formData.specialty || ''}
                            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                            disabled={!isEditing}
                            className="border-border"
                            placeholder="Yoga, Bodybuilding, HIIT..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Experience (Years)</Label>
                          <Input
                            type="number"
                            value={formData.experienceYear || ''}
                            onChange={(e) => setFormData({ ...formData, experienceYear: parseInt(e.target.value) || 0 })}
                            disabled={!isEditing}
                            className="border-border"
                            placeholder="5"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Certificate</Label>
                          <Input
                            value={formData.certificate || ''}
                            onChange={(e) => setFormData({ ...formData, certificate: e.target.value })}
                            disabled={!isEditing}
                            className="border-border"
                            placeholder="Certification details"
                          />
                        </div>
                      </div>
                    )}
                  </TabsContent>
                )}

                {profileData.role === "BUSINESS" && (
                  <TabsContent value="business" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Business Name</Label>
                        <Input
                          value={formData.businessName || ''}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          disabled={!isEditing}
                          className="border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tax Code</Label>
                        <Input
                          value={formData.taxCode || ''}
                          onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                          disabled={!isEditing}
                          className="border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Textarea
                          value={formData.address || ''}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          disabled={!isEditing}
                          rows={3}
                          className="border-border resize-none"
                        />
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
