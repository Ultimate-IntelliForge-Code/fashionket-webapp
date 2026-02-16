import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { MessageSquare } from "lucide-react";

export function OrdersSidebar() {
  const PhoneIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );

  const MailIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Order Status Guide */}
      <Card className="border-gray-200">
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg">
            Order Status Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-2">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500" />
              <span className="text-xs sm:text-sm">
                Pending Payment - Awaiting payment
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500" />
              <span className="text-xs sm:text-sm">
                Processing - Order confirmed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-500" />
              <span className="text-xs sm:text-sm">Shipped - On its way</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500" />
              <span className="text-xs sm:text-sm">
                Delivered - Order received
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500" />
              <span className="text-xs sm:text-sm">
                Cancelled - Order cancelled
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Need Help? */}
      <Card className="border-gray-200">
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg">Need Help?</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Contact our support team
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-2">
          <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            <li className="flex items-center gap-2">
              <PhoneIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Call: 0701-726-2642</span>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Email: support@fashionket.com</span>
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Live Chat: Available 24/7</span>
            </li>
          </ul>
          <Button
            variant="default"
            className="w-full mt-3 sm:mt-4 h-8 sm:h-9 text-xs sm:text-sm"
            asChild
          >
            <Link to="/contact">Contact Support</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Return Policy */}
      <Card className="border-gray-200">
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg">Return Policy</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-2">
          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
            <p>• 14-day return window</p>
            <p>• Items must be unworn with tags</p>
            <p>• Free returns for defective items</p>
            <p>• Refunds processed in 5-7 business days</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
