import React from 'react';
import { Link } from '@tanstack/react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Eye, Package } from 'lucide-react';
import type { IOrderListItem } from '@/types';
import { format } from 'date-fns';
import { PaymentStatusBadge } from './payment-status-badge';
import { OrderStatusBadge } from './order-status-badge';

interface OrdersTableProps {
  orders: IOrderListItem[];
  showActions?: boolean;
  variant?: 'customer' | 'vendor' | 'admin';
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ 
  orders, 
  showActions = true,
  variant = 'customer'
}) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-brand-primary-soft">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-primary-soft mb-4">
          <Package className="h-6 w-6 text-brand-primary" />
        </div>
        <p className="text-brand-muted">No orders found</p>
      </div>
    );
  }

  const getActionPath = (orderId: string) => {
    switch (variant) {
      case 'vendor':
        return `/vendor/orders/${orderId}`;
      case 'admin':
        return `/admin/orders/${orderId}`;
      default:
        return `/orders/${orderId}`;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-brand-primary-soft overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-brand-surface border-b-brand-primary-soft">
              <TableHead className="font-semibold text-brand-dark">Order ID</TableHead>
              <TableHead className="font-semibold text-brand-dark">Date</TableHead>
              <TableHead className="font-semibold text-brand-dark">Items</TableHead>
              <TableHead className="font-semibold text-brand-dark">Total</TableHead>
              <TableHead className="font-semibold text-brand-dark">Status</TableHead>
              <TableHead className="font-semibold text-brand-dark">Payment</TableHead>
              {showActions && <TableHead className="text-right font-semibold text-brand-dark">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id.toString()} className="hover:bg-brand-primary-soft/20 transition-colors">
                <TableCell className="font-mono text-sm font-medium text-brand-dark">
                  #{order.orderNumber?.slice(-8) || order._id.slice(-8)}
                </TableCell>
                <TableCell className="text-brand-muted text-sm">
                  {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Package className="h-3.5 w-3.5 text-brand-muted" />
                    <span className="text-sm text-brand-dark">{order.itemCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-brand-primary">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} showIcon={false} />
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={order.paymentStatus} showIcon={false} />
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="hover:bg-brand-primary-soft text-brand-primary"
                    >
                      <Link to={getActionPath(order._id.toString())}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};