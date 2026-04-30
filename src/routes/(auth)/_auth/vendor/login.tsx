import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks";
import { Loader2, Shield, Mail, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useVendorLogin } from "@/api/mutations";
import { toast } from "react-toastify";
import { AuthFormWrapper } from "@/components/auth";
import { LoginFormData, loginSchema } from "@/lib";
import { ApiError } from "@/api";

export const Route = createFileRoute("/(auth)/_auth/vendor/login")({
  component: VendorLogin,
});

function VendorLogin() {
  const { isAuthenticated, isVendor, setAuthVendor } = useAuth();
  const navigate = useNavigate();
  const { mutateAsync: login, isPending } = useVendorLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema as any),
  });

  if (isAuthenticated && isVendor) {
    return <Navigate to="/vendor" />;
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);
      setAuthVendor(response.data);
      toast.success(response.message || "Login successful!");
      navigate({ to: "/vendor" });
    } catch (error) {
      const err = error as ApiError;
      console.error(err);
      toast.error(err.message || "Login failed");
      setError("root", {
        message: err.message || "Login failed. Please try again.",
      });
    }
  };

  const footer = (
    <div className="text-center space-y-3">
      <div className="text-sm text-brand-muted">
        Don't have a store account?{" "}
        <Link
          to="/vendor/register"
          className="font-medium text-brand-primary hover:text-brand-primary-hover hover:underline transition-colors"
        >
          Register Your Store
        </Link>
      </div>
      <div className="text-sm text-brand-muted">
        <Link
          to="/vendor/forgot-password"
          className="font-medium text-brand-primary hover:text-brand-primary-hover hover:underline transition-colors"
        >
          Forgot your password?
        </Link>
      </div>
      <div className="text-sm text-brand-muted pt-3 border-t border-brand-primary-soft">
        Are you a customer?{" "}
        <Link
          to="/login"
          className="font-medium text-brand-accent hover:text-brand-accent/80 hover:underline transition-colors"
        >
          Customer Login
        </Link>
      </div>
    </div>
  );

  return (
    <AuthFormWrapper
      title={
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-brand-primary" />
          <span>Store Login</span>
        </div>
      }
      description="Sign in to your store account to manage your business"
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Root Error Display */}
        {errors.root && (
          <div className="p-4 rounded-xl bg-brand-error/10 border border-brand-error/20">
            <p className="text-sm text-brand-error">{errors.root.message}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-brand-dark font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
            <Input
              id="email"
              type="email"
              placeholder="store@example.com"
              className="pl-9 h-11 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
              {...register("email")}
              disabled={isPending}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-brand-error">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-brand-dark font-medium">
              Password
            </Label>
            <Link
              to="/vendor/forgot-password"
              className="text-xs text-brand-primary hover:text-brand-primary-hover transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-9 h-11 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
              {...register("password")}
              disabled={isPending}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-brand-error">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm transition-all duration-200"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In to Store"
          )}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}