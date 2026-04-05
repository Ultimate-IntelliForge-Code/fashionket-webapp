import type { IOrderListItem } from './order.types';
import type { OrderStatus } from './enums';

export interface IVendorDashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  byStatus: Partial<Record<OrderStatus, { count: number; totalAmount: number }>>;
  recentOrders: IOrderListItem[];
}

export interface IVendorChartsStats {
  salesData: Array<{
    name: string;
    products: number;
    profit: number;
  }>;
  orderStatusData: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
}
