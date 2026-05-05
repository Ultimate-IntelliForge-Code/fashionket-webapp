import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Home,
  Package,
  HelpCircle,
  ArrowLeft,
  Search,
  ShoppingBag,
} from "lucide-react";
import { motion } from "framer-motion";

export function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate({ to: ".." });
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 sm:py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-2xl w-full"
      >
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-brand-primary-soft overflow-hidden">
          {/* Decorative Header */}
          <div className="relative bg-gradient-to-br from-brand-primary via-brand-primary-hover to-brand-dark px-6 py-12 sm:px-8 sm:py-16 text-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
                }}
              />
            </div>

            {/* 404 Illustration */}
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-6">
                    <ShoppingBag className="h-16 w-16 text-white" />
                  </div>
                </div>
              </div>

              <h1 className="text-7xl sm:text-8xl font-bold text-white mb-4 tracking-tighter">
                404
              </h1>
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
                <p className="text-white font-medium text-sm sm:text-base">
                  Page Not Found
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mb-3">
                Oops! Looks like you're lost
              </h2>
              <p className="text-brand-muted text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                The page you are looking for doesn't exist or has been moved.
                Don't worry, we're here to help you find your way back.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={() => navigate({ to: "/" })}
                  className="bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md hover:shadow-lg transition-all duration-300 rounded-lg py-2.5"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Homepage
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate({ to: "/products" })}
                  className="border-brand-primary text-brand-primary hover:bg-brand-primary-soft transition-all duration-300 rounded-lg py-2.5"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Browse Products
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="ghost"
                  onClick={handleGoBack}
                  className="text-brand-muted hover:text-brand-primary hover:bg-brand-primary-soft transition-all duration-300 rounded-lg"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => navigate({ to: "/search" })}
                  className="text-brand-muted hover:text-brand-primary hover:bg-brand-primary-soft transition-all duration-300 rounded-lg"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Again
                </Button>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-6 border-t border-brand-primary-soft">
              <div className="flex items-center justify-center gap-2 text-sm text-brand-muted">
                <HelpCircle className="h-4 w-4" />
                <span>
                  Need help?{" "}
                  <button
                    onClick={() => navigate({ to: "/contact" })}
                    className="text-brand-primary hover:underline font-medium"
                  >
                    Contact our support team
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Links */}
        <div className="mt-8 text-center">
          <p className="text-xs text-brand-muted">
            You might want to check out our{" "}
            <button
              onClick={() => navigate({ to: "/categories" })}
              className="text-brand-primary hover:underline font-medium"
            >
              categories
            </button>{" "}
            or{" "}
            <button
              onClick={() => navigate({ to: "/vendors" })}
              className="text-brand-primary hover:underline font-medium"
            >
              featured vendors
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;
