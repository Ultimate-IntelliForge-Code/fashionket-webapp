import React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminLogin } from "@/api/mutations";
import { useAuth } from "@/hooks";
import { AuthFormWrapper, GoogleAuthButton } from "@/components/auth";
import { Eye, EyeOff, Building2, AlertCircle, Shield } from "lucide-react";
import { toast } from "react-toastify";
import { LoginFormData, loginSchema } from "@/lib";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(auth)/_auth/admin/login")({
  component: AdminLoginPage,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const { mutate: login, isPending } = useAdminLogin();
  const { setAuthAdmin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      login(data, {
        onSuccess: (response) => {
          if (response.success) {
            setAuthAdmin(response.data);
            toast.success("Welcome back! Successfully logged in as admin.");
            navigate({ to: "/admin" });
          }
        },
        onError: (error: any) => {
          toast.error(error.message || "Login failed, Invalid credentials");
        },
      });
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message: error.message || "Admin login failed. Please try again.",
      });
    }
  };

  const footer = (
    <div className="text-center space-y-3">
      <div className="text-sm text-brand-muted">
        <Link
          to="/admin/forgot-password"
          className="font-medium text-brand-primary hover:text-brand-primary-hover hover:underline transition-colors"
        >
          Forgot your password?
        </Link>
      </div>
      <div className="text-sm text-brand-muted">
        Don't have an admin account?{" "}
        <Link
          to="/admin/register"
          className="font-medium text-brand-primary hover:text-brand-primary-hover hover:underline transition-colors"
        >
          Request Access
        </Link>
      </div>
    </div>
  );

  return (
    <AuthFormWrapper
      title={
        <div className="flex items-center justify-center gap-2">
          <Building2 className="h-6 w-6 text-brand-primary" />
          <span className="text-brand-dark">Business Portal</span>
        </div>
      }
      description="Sign in to manage your FashionKet store"
      backLink="/"
      backText="Back to store"
      footer={footer}
    >
      {/* Security Notice */}
      <div className="mb-6 p-4 bg-brand-primary-soft/30 border border-brand-primary-soft rounded-xl">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-brand-dark mb-1">Secure Admin Access</p>
            <p className="text-brand-muted text-xs">
              This portal is for store administrators only. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Root Error */}
        {errors.root && (
          <div className="flex items-start gap-2 p-3 bg-brand-error/10 border border-brand-error/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-brand-error mt-0.5 flex-shrink-0" />
            <p className="text-sm text-brand-error">{errors.root.message}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-brand-dark font-medium">
            Admin Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@fashionket.com"
            {...register("email")}
            className={cn(
              "border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft",
              errors.email && "border-brand-error focus:border-brand-error"
            )}
          />
          {errors.email && (
            <p className="text-sm text-brand-error">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-brand-dark font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={cn(
                "pr-10 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft",
                errors.password && "border-brand-error focus:border-brand-error"
              )}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-brand-error">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rememberMe" 
              {...register("rememberMe")}
              className="border-brand-primary-soft data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
            />
            <Label
              htmlFor="rememberMe"
              className="text-sm font-normal text-brand-muted cursor-pointer"
            >
              Remember me
            </Label>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md hover:shadow-lg transition-all duration-300"
          disabled={isPending}
          size="lg"
        >
          {isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              Signing in...
            </>
          ) : (
            "Sign in as Admin"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-brand-primary-soft"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-brand-muted">Or continue with</span>
        </div>
      </div>

      <GoogleAuthButton variant="admin" disabled={isPending} />
    </AuthFormWrapper>
  );
}