import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { MessageSquare, Phone, Mail, HelpCircle, RotateCcw, Shield } from "lucide-react";

export function OrdersSidebar() {
  const statusSteps = [
    { label: "Pending Payment", color: "brand-warning", description: "Awaiting payment confirmation" },
    { label: "Processing", color: "brand-primary", description: "Order confirmed & being prepared" },
    { label: "Shipped", color: "brand-info", description: "Order on its way to you" },
    { label: "Delivered", color: "brand-success", description: "Order successfully delivered" },
    { label: "Cancelled", color: "brand-error", description: "Order was cancelled" },
  ];

  return (
    <div className="space-y-5">
      {/* Order Status Guide */}
      <Card className="border-brand-primary-soft shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-brand-primary" />
            <CardTitle className="text-base font-semibold text-brand-dark">
              Order Status Guide
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-brand-muted">
            Track your order at every step
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="space-y-3">
            {statusSteps.map((step, index) => (
              <div key={step.label} className="flex items-start gap-3">
                <div className="relative flex-shrink-0 mt-0.5">
                  <div className={`w-2 h-2 rounded-full bg-${step.color}`} />
                  {index < statusSteps.length - 1 && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-brand-primary-soft" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-brand-dark">{step.label}</p>
                  <p className="text-xs text-brand-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Need Help? */}
      <Card className="border-brand-primary-soft shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-brand-primary" />
            <CardTitle className="text-base font-semibold text-brand-dark">
              Need Help?
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-brand-muted">
            Our support team is here for you
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-primary-soft transition-colors">
              <Phone className="h-4 w-4 text-brand-primary" />
              <div>
                <p className="text-xs text-brand-muted">Call us</p>
                <p className="text-sm font-medium text-brand-dark">+234 701 726 2642</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-primary-soft transition-colors">
              <Mail className="h-4 w-4 text-brand-primary" />
              <div>
                <p className="text-xs text-brand-muted">Email us</p>
                <p className="text-sm font-medium text-brand-dark">support@fashionket.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-primary-soft transition-colors">
              <MessageSquare className="h-4 w-4 text-brand-primary" />
              <div>
                <p className="text-xs text-brand-muted">Live chat</p>
                <p className="text-sm font-medium text-brand-dark">Available 24/7</p>
              </div>
            </div>
          </div>
          <Button
            className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm"
            asChild
          >
            <Link to="/contact">
              <HelpCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Return Policy */}
      <Card className="border-brand-primary-soft shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-brand-primary" />
            <CardTitle className="text-base font-semibold text-brand-dark">
              Return Policy
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="space-y-2">
            {[
              "14-day return window for eligible items",
              "Items must be unworn with original tags",
              "Free returns for defective products",
              "Refunds processed in 5-7 business days",
            ].map((policy, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <Shield className="h-3.5 w-3.5 text-brand-success mt-0.5 flex-shrink-0" />
                <span className="text-brand-muted">{policy}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}