import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks";
import { Loader2 } from "lucide-react";
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

      toast.success(response.message || "Login Successfully!");

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
    <div className="text-center space-y-2">
      <div className="text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/vendor/register"
          className="font-medium text-mmp-primary hover:text-mmp-primary2 hover:underline"
        >
          Register Your Store
        </Link>
      </div>
      <div className="text-sm text-gray-600">
        <Link
          to="/forgot-password"
          className="font-medium text-mmp-primary hover:text-mmp-primary2 hover:underline"
        >
          Forgot your password?
        </Link>
      </div>
      <div className="text-sm text-gray-600 pt-2 border-t border-gray-200">
        Are you a customer?{" "}
        <Link
          to="/login"
          className="font-medium text-mmp-secondary hover:text-mmp-accent hover:underline"
        >
          Customer Login
        </Link>
      </div>
    </div>
  );

  return (
    <AuthFormWrapper
      title="Store Login"
      description="Sign in to your store account to manage your store"
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{errors.root.message}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="vendor@example.com"
            {...register("email")}
            disabled={isPending}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            disabled={isPending}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-mmp-primary hover:bg-mmp-primary2"
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
