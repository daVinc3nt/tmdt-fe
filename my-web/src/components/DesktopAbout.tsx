import { ArrowLeft, Target, Users, Award, Heart, Dumbbell, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MascotLogo } from "./MascotLogo";

interface DesktopAboutProps {
  onBack: () => void;
}

export function DesktopAbout({ onBack }: DesktopAboutProps) {
  const stats = [
    { label: "Active Trainers", value: "500+", icon: Users },
    { label: "Happy Customers", value: "10,000+", icon: Heart },
    { label: "Training Sessions", value: "50,000+", icon: Dumbbell },
    { label: "Success Rate", value: "95%", icon: TrendingUp },
  ];

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To make professional fitness training accessible to everyone, anywhere, anytime.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a supportive community where fitness goals are achieved together.",
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "Verified trainers and premium products for the best fitness experience.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
      bio: "Former professional athlete with 15+ years in fitness industry",
    },
    {
      name: "Mike Chen",
      role: "Head of Training",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      bio: "Certified master trainer and sports science specialist",
    },
    {
      name: "Emily Davis",
      role: "Product Director",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      bio: "Expert in fitness technology and user experience",
    },
  ];

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

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <MascotLogo className="w-16 h-16" />
                <div>
                  <h1 className="text-foreground">FitConnect</h1>
                  <p className="text-primary">Find Your Strength</p>
                </div>
              </div>
              <h2 className="text-foreground mb-4">Connecting Fitness Enthusiasts with Professional Trainers</h2>
              <p className="text-muted-foreground text-lg mb-6">
                FitConnect is more than just a platform – it's a community dedicated to helping you achieve your fitness goals. 
                We bridge the gap between professional personal trainers and fitness enthusiasts, making quality training accessible to everyone.
              </p>
              <div className="flex gap-4">
                <Button className="bg-primary text-white">Get Started</Button>
                <Button variant="outline">Become a Trainer</Button>
              </div>
            </div>
            <div className="rounded-[20px] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1717500252010-d708ec89a0a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY29tcGFueSUyMG9mZmljZXxlbnwxfHx8fDE3NjIyNTQ2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="FitConnect Team"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="rounded-[20px] border-border p-6 text-center">
                <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-4xl text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-foreground mb-4">Our Core Values</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The principles that guide everything we do at FitConnect
          </p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="rounded-[20px] border-border p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-foreground mb-3">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 gap-12 items-center">
            <div className="rounded-[20px] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"
                alt="Our Story"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div>
              <h2 className="text-foreground mb-4">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2020, FitConnect started with a simple idea: make professional fitness training accessible to everyone. 
                  Our founders, passionate fitness enthusiasts themselves, noticed the gap between people wanting to get fit and 
                  finding the right professional guidance.
                </p>
                <p>
                  What began as a small platform connecting local trainers with fitness seekers has grown into a thriving community 
                  of over 10,000 members and 500 certified trainers. We've facilitated over 50,000 training sessions, helping 
                  thousands achieve their fitness goals.
                </p>
                <p>
                  Today, FitConnect is not just a booking platform – it's a complete fitness ecosystem. From personalized training 
                  sessions to premium fitness products, we provide everything you need on your fitness journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-foreground mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The passionate people behind FitConnect
          </p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="rounded-[20px] border-border overflow-hidden">
              <ImageWithFallback
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-foreground mb-1">{member.name}</h3>
                <p className="text-primary mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-primary to-primary/80 border-t border-primary">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-white mb-4">Ready to Start Your Fitness Journey?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and find your perfect trainer today
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Find a Trainer
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
