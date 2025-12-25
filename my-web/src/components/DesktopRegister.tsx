import {
  Activity, Award,
  Briefcase,
  Dumbbell,
  Eye, EyeOff,
  Lock,
  Mail,
  MapPin,
  User as UserIcon
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { MascotFull } from "./MascotFull";
import { MascotLogo } from "./MascotLogo";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const initialFormState = {
  email: '',
  password: '',
  fullName: '',
  businessName: '',
  dateOfBirth: '',
  gender: 'MALE',
  height: '',
  weight: '',
  goal: '',
  specialty: '',
  experienceYear: 0,
  bio: '',
  certificate: '',
  taxCode: '',
  address: ''
};

export function DesktopRegister() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [selectedRole, setSelectedRole] = useState<'TRAINEE' | 'TRAINER' | 'BUSINESS'>('TRAINEE');
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experienceYear' ? Number(value) : value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let endpoint = "";
      let payload = {};

      if (selectedRole === 'TRAINEE') {
        endpoint = "/auth/register/trainee";
        payload = {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth || "",
          gender: formData.gender,
          height: formData.height || "",
          weight: formData.weight || "",
          goal: formData.goal || ""
        };
      }
      else if (selectedRole === 'TRAINER') {
        endpoint = "/auth/register/trainer";
        payload = {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          certificate: formData.certificate || "",
          specialty: formData.specialty,
          experienceYear: formData.experienceYear || 0,
          bio: formData.bio || ""
        };
      }
      else if (selectedRole === 'BUSINESS') {
        endpoint = "/auth/register/business";
        payload = {
          email: formData.email,
          password: formData.password,
          businessName: formData.businessName,
          taxCode: formData.taxCode,
          address: formData.address
        };
      }

      console.log(`Calling API: POST ${endpoint}`, payload);
      await api.post(endpoint, payload);

      alert(`Successfully registered as ${selectedRole}! Please sign in.`);
      navigate('/login');

    } catch (err: any) {
      console.error("Register Error:", err);
      const errorMsg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">

        <div className="hidden md:flex flex-col items-center justify-center text-center sticky top-10">
          <MascotFull className="w-96 h-96 mb-8" />
          <h1 className="text-foreground mb-3">Join FitConnect Today</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Create your account to start your fitness journey, grow your career, or expand your business.
          </p>
          <div className="mt-8 flex gap-3">
            <Badge className="bg-primary text-white px-4 py-2">Find Trainers</Badge>
            <Badge className="bg-primary text-white px-4 py-2">Book Sessions</Badge>
            <Badge className="bg-primary text-white px-4 py-2">Shop Products</Badge>
          </div>
        </div>

        <Card className="rounded-[20px] border-border p-8 bg-card shadow-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="mb-6 flex flex-col items-center">
            <MascotLogo className="w-20 h-20 mb-4" />
            <h2 className="text-foreground mb-2">Create Account</h2>
            <p className="text-muted-foreground">Fill in your details to get started</p>
            {error && <p className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded">{error}</p>}
          </div>

          <form onSubmit={handleRegister} className="space-y-5">

            <div className="grid grid-cols-3 gap-2 p-1 bg-secondary/20 rounded-[20px]">
              {(['TRAINEE', 'TRAINER', 'BUSINESS'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`py-2 text-sm font-medium rounded-[16px] transition-all ${selectedRole === role
                    ? 'bg-primary text-white shadow-md'
                    : 'text-muted-foreground hover:bg-secondary/50'
                    }`}
                >
                  {role === 'TRAINEE' ? 'Trainee' : role === 'TRAINER' ? 'Trainer' : 'Business'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{selectedRole === 'BUSINESS' ? 'Business Name' : 'Full Name'}</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    name={selectedRole === 'BUSINESS' ? "businessName" : "fullName"}
                    placeholder={selectedRole === 'BUSINESS' ? "Gym Center Name" : "John Doe"}
                    onChange={handleChange} required
                    className="h-12 rounded-[20px] pl-10 border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    name="email" type="email" placeholder="email@fitconnect.com" onChange={handleChange} required
                    className="h-12 rounded-[20px] pl-10 border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    name="password" type={showPassword ? "text" : "password"} placeholder="Create a password" onChange={handleChange} required
                    className="h-12 rounded-[20px] pl-10 pr-10 border-border"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedRole !== 'BUSINESS' && (
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input name="dateOfBirth" type="date" onChange={handleChange} className="h-12 rounded-[20px] border-border" />
                  </div>
                )}
                {selectedRole !== 'BUSINESS' && (
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <div className="relative h-12">
                      <select name="gender" onChange={handleChange} className="w-full h-full rounded-[20px] px-4 border border-border bg-background appearance-none">
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
              <div className="relative flex justify-center"><span className="bg-card px-4 text-xs text-muted-foreground uppercase">Role Specific Details</span></div>
            </div>

            {selectedRole === 'TRAINEE' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input name="height" type="number" placeholder="170" onChange={handleChange} className="h-12 rounded-[20px]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input name="weight" type="number" placeholder="65" onChange={handleChange} className="h-12 rounded-[20px]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Fitness Goal</Label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input name="goal" placeholder="e.g. Lose weight, Build muscle" onChange={handleChange} className="h-12 rounded-[20px] pl-10" />
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'TRAINER' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-2">
                  <Label>Specialty</Label>
                  <div className="relative">
                    <Dumbbell className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input name="specialty" placeholder="Yoga, Bodybuilding, HIIT..." onChange={handleChange} required className="h-12 rounded-[20px] pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Experience (Years)</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input name="experienceYear" type="number" placeholder="5" onChange={handleChange} required className="h-12 rounded-[20px] pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bio / Intro</Label>
                  <textarea name="bio" placeholder="Brief introduction about yourself..." onChange={handleChange} className="w-full min-h-[80px] rounded-[20px] p-4 border border-border bg-background" />
                </div>
              </div>
            )}

            {selectedRole === 'BUSINESS' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-2">
                  <Label>Tax Code</Label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input name="taxCode" placeholder="Business Tax ID" onChange={handleChange} required className="h-12 rounded-[20px] pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input name="address" placeholder="123 Street, District 1..." onChange={handleChange} required className="h-12 rounded-[20px] pl-10" />
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full h-12 rounded-[20px] bg-primary text-white mt-6" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
