import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { CartProvider } from "@/providers/cart-provider";
// import { UserAuthProvider } from "@/providers/user-auth-provider";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(root)/_rootLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
      <CartProvider>
        <Header />
        <div className='className="min-h-screen"'>
          <Outlet />
        </div>
        <Footer />
      </CartProvider>
  );
}
