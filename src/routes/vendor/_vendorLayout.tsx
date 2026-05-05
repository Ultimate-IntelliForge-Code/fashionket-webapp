import { createFileRoute, Outlet } from "@tanstack/react-router";
import { VendorSideBar } from "@/components/layout/VendorSidebar";
import { VendorHeader } from "@/components/layout/VendorHeader";
import { AuthGuard } from "@/components/auth";
import React from "react";
import { UserRole } from "@/types";

export const Route = createFileRoute("/vendor/_vendorLayout")({
  component: VendorLayout,
});

function VendorLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Handle scroll effect with throttling for performance
  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  React.useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSidebarOpen]);

  return (
    <AuthGuard requireAuth={true} allowedRoles={[UserRole.VENDOR]}>
      <div className="min-h-screen bg-brand-surface">
        {/* Sidebar */}
        <VendorSideBar
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div
          className="lg:pl-72 transition-all duration-300 ease-in-out"
          role="main"
          aria-label="Vendor dashboard main content"
        >
          {/* Header - Sticky with scroll effect */}
          <div
            className={`
              sticky top-0 z-30 lg:z-20 transition-all duration-300
              ${isScrolled ? "shadow-md bg-white/95 backdrop-blur-sm" : "bg-white"}
            `}
          >
            <VendorHeader onMobileOpen={() => setIsMobileSidebarOpen(true)} />
          </div>

          {/* Main Content */}
          <main className="min-h-[calc(100vh-5rem)]">
            {/* Page Content Container */}
            <div className="bg-white shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8">
                <Outlet />
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-8 pt-6 border-t border-brand-primary-soft">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-xs text-brand-muted">
                  © 2024 FashionKet. All rights reserved.
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                  <a
                    href="#"
                    className="text-brand-muted hover:text-brand-primary transition-colors duration-200"
                  >
                    Help Center
                  </a>
                  <span className="text-brand-primary-soft select-none">•</span>
                  <a
                    href="#"
                    className="text-brand-muted hover:text-brand-primary transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                  <span className="text-brand-primary-soft select-none">•</span>
                  <a
                    href="#"
                    className="text-brand-muted hover:text-brand-primary transition-colors duration-200"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

// Export with error boundary wrapper
export default VendorLayout;
