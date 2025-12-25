import { Dumbbell, Eye, EyeOff, Home, Lock, Mail, Package } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { MascotFull } from "./MascotFull";
import { MascotLogo } from "./MascotLogo";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";


export function DesktopLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"TRAINEE" | "TRAINER" | "BUSINESS" | "ADMIN" | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const roleConfig = [
    { type: "TRAINEE" as const, icon: Home, color: "bg-blue-500", label: "Trainee", description: "Find trainers & book sessions" },
    { type: "TRAINER" as const, icon: Dumbbell, color: "bg-orange-500", label: "Trainer", description: "Manage bookings & sessions" },
    { type: "BUSINESS" as const, icon: Package, color: "bg-green-500", label: "Business", description: "Manage gym & products" },
    { type: "ADMIN" as const, icon: Lock, color: "bg-purple-500", label: "Admin", description: "Manage users & orders" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedRole) {
      setError("Please select a role.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = { username: email, password, role: selectedRole };
      const response: any = await api.post("/auth/login", payload);
      if (response && response.token) {
        const userData = { email, role: selectedRole as 'TRAINEE' | 'TRAINER' | 'BUSINESS' | 'ADMIN' };
        login(response.token, userData);
        navigate('/home');
      } else {
        setError("Invalid response from server.");
      }
    } catch (err: any) {
      const errorMsg = err?.message || "Login failed. Please check your credentials.";
      setError(errorMsg);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectRole = (role: "TRAINEE" | "TRAINER" | "BUSINESS" | "ADMIN") => {
    setSelectedRole(role);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex flex-col items-center justify-center text-center">
          <MascotFull className="w-96 h-96 mb-8" />
          <h1 className="text-foreground mb-3">Welcome to FitConnect</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Your ultimate fitness platform connecting trainers, customers, and wellness products
          </p>
          <div className="mt-8 flex gap-3">
            <Badge className="bg-primary text-white px-4 py-2">Find Trainers</Badge>
            <Badge className="bg-primary text-white px-4 py-2">Book Sessions</Badge>
            <Badge className="bg-primary text-white px-4 py-2">Shop Products</Badge>
          </div>
        </div>

        <Card className="rounded-[20px] border-border p-8 bg-card shadow-lg">
          <div className="mb-8 flex flex-col items-center">
            <MascotLogo className="w-20 h-20 mb-4" />
            <h2 className="text-foreground mb-2">Sign In</h2>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email" type="email" placeholder="email@fitconnect.com" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-[20px] pl-10 border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password" type={showPassword ? "text" : "password"} placeholder="******" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-[20px] pl-10 pr-10 border-border"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 p-4 rounded-[16px] text-sm font-medium">
                {error}
              </div>
            )}

            {selectedRole && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-200 p-4 rounded-[16px] text-sm">
                ✓ Role selected: <span className="font-semibold">{roleConfig.find(r => r.type === selectedRole)?.label}</span>
              </div>
            )}

            <Button type="submit" className="w-full h-12 rounded-[20px] bg-primary text-white" disabled={isLoading || !selectedRole}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-semibold">
              Register Now
            </Link>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Choose Your Role</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {roleConfig.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.type;
              return (
                <Button
                  key={role.type}
                  type="button"
                  variant="outline"
                  className={`h-auto py-5 px-4 rounded-[16px] border-2 transition-all flex flex-col items-center gap-3 min-h-32 ${isSelected
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary hover:bg-secondary/50"
                    }`}
                  onClick={() => selectRole(role.type)}
                >
                  <div className={`w-12 h-12 ${role.color} rounded-full flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center break-words">
                    <p className="text-sm font-bold text-foreground leading-snug">{role.label}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-tight whitespace-normal">{role.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
