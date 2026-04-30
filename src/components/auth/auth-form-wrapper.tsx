import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Sparkles, 
  Shield, 
  Truck, 
  Star,
  TrendingUp,
  Users,
  Package
} from "lucide-react";

interface AuthFormWrapperProps {
  title: React.ReactNode;
  description: string;
  children: React.ReactNode;
  backLink?: string;
  backText?: string;
  footer?: React.ReactNode;
  imageUrl?: string;
  variant?: 'login' | 'register' | 'vendor';
}

export const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({
  title,
  description,
  children,
  backLink = "/",
  backText = "Back to home",
  footer,
  imageUrl = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop",
  variant = 'login',
}) => {
  // Dynamic content based on variant
  const getHeroContent = () => {
    switch (variant) {
      case 'vendor':
        return {
          quote: "Join thousands of successful vendors on our platform",
          author: "Michael Adebayo",
          role: "Top Vendor, 2024",
          icon: TrendingUp,
          stats: [
            { label: "Active Vendors", value: "5K+", icon: Users },
            { label: "Monthly Sales", value: "₦50M+", icon: TrendingUp },
            { label: "Products", value: "100K+", icon: Package },
          ]
        };
      case 'register':
        return {
          quote: "Start your fashion journey with us today",
          author: "Chioma Okafor",
          role: "Happy Customer",
          icon: Sparkles,
          stats: [
            { label: "Happy Customers", value: "100K+", icon: Users },
            { label: "Premium Brands", value: "500+", icon: Shield },
            { label: "Fast Delivery", value: "24/7", icon: Truck },
          ]
        };
      default:
        return {
          quote: "The best platform for fashion enthusiasts. Quality products, amazing prices!",
          author: "Sarah Johnson",
          role: "Top Customer, 2024",
          icon: ShoppingBag,
          stats: [
            { label: "Products", value: "50K+", icon: Package },
            { label: "Vendors", value: "10K+", icon: Users },
            { label: "Customers", value: "100K+", icon: ShoppingBag },
          ]
        };
    }
  };

  const heroContent = getHeroContent();
  const HeroIcon = heroContent.icon;

  return (
    <div className="min-h-screen bg-brand-surface flex">
      {/* Left Side - Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 lg:p-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          {backLink && (
            <Button 
              variant="ghost" 
              className="mb-6 text-brand-primary hover:bg-brand-primary-soft transition-all duration-300 group" 
              asChild
            >
              <Link to={backLink}>
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-0.5" />
                {backText}
              </Link>
            </Button>
          )}

          {/* Form Card */}
          <Card className="border-brand-primary-soft/30 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl overflow-hidden">
            <CardHeader className="space-y-4 pt-8 pb-6">
              <div className="flex justify-center mb-2">
                <Link to="/" className="inline-block transition-transform hover:scale-105 duration-300">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="h-14 w-auto"
                  />
                </Link>
              </div>
              
              <CardTitle className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-brand-primary to-brand-primary-hover bg-clip-text text-transparent">
                {title}
              </CardTitle>
              
              <CardDescription className="text-center text-brand-muted text-base">
                {description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pb-8 px-6 md:px-8">
              {children}
              
              {footer && (
                <div className="mt-6 pt-6 border-t border-brand-primary-soft/30">
                  {footer}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Badge - Mobile */}
          <div className="mt-6 text-center lg:hidden">
            <div className="flex items-center justify-center gap-3 text-xs text-brand-muted">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>Secure</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-brand-muted" />
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span>Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image Section with Enhanced Design */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        {/* Image Container with Parallax Effect */}
        <div className="absolute inset-0">
          <img 
            src={imageUrl} 
            alt="Shopping Experience"
            className="w-full h-full object-cover transform scale-105 transition-transform duration-10000 hover:scale-110"
          />
          
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/90 via-brand-primary/70 to-brand-dark/90" />
          
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)`
          }} />
        </div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col justify-center p-12">
          {/* Hero Quote Section */}
          <div className="max-w-md mx-auto text-center animate-in fade-in slide-in-from-right duration-500">
            <div className="mb-8 flex justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-full p-4 ring-2 ring-white/20">
                <HeroIcon className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <div className="relative">
              {/* Decorative quotes */}
              <div className="absolute -top-8 -left-4 text-6xl text-white/10 font-serif">"</div>
              <blockquote className="text-white text-xl lg:text-2xl font-medium leading-relaxed mb-8 relative z-10">
                {heroContent.quote}
              </blockquote>
              <div className="absolute -bottom-8 -right-4 text-6xl text-white/10 font-serif">"</div>
            </div>
            
            {/* Rating Stars */}
            <div className="flex justify-center gap-1.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-brand-accent text-brand-accent animate-in zoom-in duration-300" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
            
            <div>
              <p className="text-white font-semibold text-lg">{heroContent.author}</p>
              <p className="text-white/70 text-sm">{heroContent.role}</p>
            </div>
          </div>

          {/* Enhanced Stats Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md py-5 px-8 border-t border-white/10">
            <div className="flex justify-around gap-4">
              {heroContent.stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div key={index} className="text-center group cursor-pointer">
                    <div className="flex items-center justify-center mb-2">
                      <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
                        <StatIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-white/60 text-xs mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Brand Logo Watermark */}
          <div className="absolute top-8 right-8 opacity-20">
            <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Import Lock icon if not already imported
import { Lock } from 'lucide-react';