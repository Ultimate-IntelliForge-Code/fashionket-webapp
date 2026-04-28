import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks";
import { VendorSideBar } from "@/components/layout/VendorSidebar";
import { VendorHeader } from "@/components/layout/VendorHeader";
import React from "react";
import { VendorAuthProvider } from "@/providers/auth-provider";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/vendor/_vendorLayout")({
  component: VendorLayout,
});

function VendorLayout() {
  const { isAuthenticated, isVendor } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Handle scroll effect for main content
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isAuthenticated || !isVendor) {
    return <Navigate to="/vendor/login" />;
  }

  return (
    <VendorAuthProvider>
      <div className="min-h-screen bg-mmp-primary2/5">
        {/* Mobile Sidebar Overlay with Animation */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <VendorSideBar
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="lg:pl-72 transition-all duration-300">
          {/* Header - Sticky with scroll effect */}
          <div className={`sticky top-0 z-30 lg:z-20 transition-all duration-300 ${
            isScrolled ? "shadow-lg" : ""
          }`}>
            <VendorHeader onMobileOpen={() => setIsMobileSidebarOpen(true)} />
          </div>

          {/* Main Content */}
          <main className="min-h-[calc(100vh-4rem)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
            >
              {/* Page Content */}
              <div className="bg-white rounded-xl shadow-sm border border-mmp-primary2/20 p-6 lg:p-8">
                <Outlet />
              </div>

              {/* Footer */}
              <footer className="mt-8 pt-6 border-t border-mmp-primary2/20">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-xs text-mmp-primary/40">
                    © 2024 FashionKet. All rights reserved.
                  </div>
                  <div className="flex items-center gap-4 text-xs text-mmp-primary/40">
                    <a href="#" className="hover:text-mmp-primary transition-colors">
                      Help Center
                    </a>
                    <a href="#" className="hover:text-mmp-primary transition-colors">
                      Privacy Policy
                    </a>
                    <a href="#" className="hover:text-mmp-primary transition-colors">
                      Terms of Service
                    </a>
                  </div>
                </div>
              </footer>
            </motion.div>
          </main>
        </div>
      </div>
    </VendorAuthProvider>
  );
}