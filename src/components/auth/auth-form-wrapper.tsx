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
import { ArrowLeft, ShoppingBag, Sparkles, Shield, Truck, Star } from "lucide-react";

interface AuthFormWrapperProps {
  title: React.ReactNode;
  description: string;
  children: React.ReactNode;
  backLink?: string;
  backText?: string;
  footer?: React.ReactNode;
  imageUrl?: string;
}

export const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({
  title,
  description,
  children,
  backLink = "/",
  backText = "Back to home",
  footer,
  imageUrl = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop",
}) => {
  return (
    <div className="min-h-screen bg-mmp-primary2/5 flex">
      {/* Left Side - Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          {/* Back Button */}
          {backLink && (
            <Button 
              variant="ghost" 
              className="mb-6 text-mmp-primary hover:bg-mmp-primary2/20 transition-all duration-300" 
              asChild
            >
              <Link to={backLink}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {backText}
              </Link>
            </Button>
          )}

          {/* Form Card */}
          <Card className="border-mmp-primary2/20 shadow-xl bg-white">
            <CardHeader className="space-y-3 pt-8">
              <div className="flex justify-center mb-2">
                <Link to="/" className="inline-block">
                  <img
                    src="/logo.png"
                    alt="FashionKet Logo"
                    className="h-14 w-auto"
                  />
                </Link>
              </div>
              
              <CardTitle className="text-2xl font-bold text-center text-mmp-primary">
                {title}
              </CardTitle>
              
              <CardDescription className="text-center text-mmp-primary/60 text-base">
                {description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-5 pb-8">
              {children}
              
              {footer && (
                <div className="mt-8 pt-5 border-t border-mmp-primary2/20">
                  {footer}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Image Section with Gradient Overlay */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        {/* Image Container */}
        <div className="absolute inset-0">
          <img 
            src={imageUrl} 
            alt="Fashion Shopping"
            className="w-full h-full object-cover"
          />
          {/* Overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-mmp-primary/80 via-mmp-primary/50 to-mmp-primary/30" />
        </div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col justify-center p-12">
          {/* Quote/Testimonial */}
          <div className="max-w-md mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <blockquote className="text-white text-xl lg:text-2xl font-medium leading-relaxed mb-6">
              "The best platform for fashion entrepreneurs. 
              I've grown my business 3x since joining FashionKet!"
            </blockquote>
            
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            
            <p className="text-white font-semibold">Sarah Johnson</p>
            <p className="text-white/70 text-sm">Top Vendor, 2024</p>
          </div>

          {/* Stats Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm py-4 px-8">
            <div className="flex justify-around">
              <div className="text-center">
                <div className="text-white font-bold text-lg">50K+</div>
                <div className="text-white/70 text-xs">Products</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-lg">10K+</div>
                <div className="text-white/70 text-xs">Vendors</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-lg">100K+</div>
                <div className="text-white/70 text-xs">Customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};