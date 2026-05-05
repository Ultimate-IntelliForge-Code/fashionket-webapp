import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DollarSign, 
  TrendingDown, 
  Wallet as WalletIcon, 
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Banknote,
  Building2,
  Hash,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { Pagination } from '@/components/ui/pagination';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { StatsCard } from '@/components/ui/stats-card';
import { WithdrawalFormData, withdrawalSchema } from '@/lib';
import { useWalletStatsQuery, useWithdrawalsQuery, useRequestWithdrawalMutation } from '@/api/hooks/wallet.hook';
import { WithdrawalStatusBadge } from '@/components/ui/withdrawal-status-badge';
import { ApiError } from '@/api/client';
import { WithdrawalStatus } from '@/types';

export const Route = createFileRoute('/vendor/_vendorLayout/wallet/')({
  component: VendorWallet,
});

function VendorWallet() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema as any),
    defaultValues: {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      amount: 0,
    },
  });

  const { data: walletStats, isLoading: walletLoading } = useWalletStatsQuery();
  const {
    data: withdrawalsData,
    isLoading: withdrawalsLoading,
    isFetching: withdrawalsFetching,
  } = useWithdrawalsQuery({ page, limit });
  const { mutateAsync: requestWithdrawal, isPending: submitting } = useRequestWithdrawalMutation();

  const netProfit = walletStats?.netProfit ?? 0;
  const balance = walletStats?.balance ?? 0;
  const totalWithdrawals = walletStats?.totalWithdrawals ?? 0;
  const platformCharges = walletStats?.platformCharges ?? 0;

  const onSubmit = async (data: WithdrawalFormData) => {
    try {
      await requestWithdrawal({
        accountHolderName: data.accountHolderName,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        amount: data.amount,
      });
      toast.success('Withdrawal request submitted successfully');
      setOpen(false);
      reset();
    } catch (error: any) {
      const message = getWithdrawalErrorMessage(error);
      toast.error(message);
    }
  };

  const totalPages = withdrawalsData?.pagination.totalPages ?? 1;
  const total = withdrawalsData?.pagination.total ?? 0;
  const paginatedWithdrawals = withdrawalsData?.items ?? [];
  const isWithdrawalsLoading = withdrawalsLoading || withdrawalsFetching;

  // Get status icon for withdrawal items
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-brand-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-brand-warning" />;
      case 'rejected':
      case 'failed':
        return <XCircle className="h-4 w-4 text-brand-error" />;
      default:
        return <AlertCircle className="h-4 w-4 text-brand-muted" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm hover:shadow-md transition-all duration-300 rounded-lg px-6 py-2.5">
              <Banknote className="h-4 w-4 mr-2" />
              Request Withdrawal
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-primary to-brand-primary-hover px-6 py-4">
              <DialogHeader>
                <DialogTitle className="text-white text-xl">Withdrawal Request</DialogTitle>
                <DialogDescription className="text-white/80 text-sm">
                  Enter your bank details and amount to withdraw
                </DialogDescription>
              </DialogHeader>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-6 pb-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="accountHolderName" className="text-brand-dark font-semibold">
                  Account Holder Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                  <Input
                    id="accountHolderName"
                    {...register('accountHolderName')}
                    placeholder="John Doe"
                    className="pl-9 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20 rounded-lg"
                  />
                </div>
                {errors.accountHolderName && (
                  <p className="text-sm text-brand-error mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.accountHolderName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName" className="text-brand-dark font-semibold">
                  Bank Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                  <Input
                    id="bankName"
                    {...register('bankName')}
                    placeholder="Access Bank"
                    className="pl-9 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20 rounded-lg"
                  />
                </div>
                {errors.bankName && (
                  <p className="text-sm text-brand-error mt-1">{errors.bankName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber" className="text-brand-dark font-semibold">
                  Account Number
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                  <Input
                    id="accountNumber"
                    {...register('accountNumber')}
                    placeholder="0123456789"
                    className="pl-9 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20 rounded-lg"
                  />
                </div>
                {errors.accountNumber && (
                  <p className="text-sm text-brand-error mt-1">{errors.accountNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-brand-dark font-semibold">
                  Amount (₦)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                  <Input
                    id="amount"
                    type="number"
                    {...register('amount', { valueAsNumber: true })}
                    placeholder="0.00"
                    className="pl-9 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20 rounded-lg"
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-brand-error mt-1">{errors.amount.message}</p>
                )}
                <div className="bg-brand-primary-soft/50 rounded-lg p-3 mt-2">
                  <p className="text-sm text-brand-dark">
                    Available balance: <span className="font-semibold text-brand-primary">{formatCurrency(balance)}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)} 
                  className="flex-1 border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm rounded-lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </div>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Net Profit"
          value={walletLoading ? 'Loading…' : formatCurrency(netProfit)}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          className="border-brand-primary-soft hover:shadow-md transition-all duration-300"
        />
        <StatsCard
          title="Available Balance"
          value={walletLoading ? 'Loading…' : formatCurrency(balance)}
          icon={WalletIcon}
          className="border-brand-primary-soft hover:shadow-md transition-all duration-300"
        />
        <StatsCard
          title="Total Withdrawals"
          value={walletLoading ? 'Loading…' : formatCurrency(totalWithdrawals)}
          icon={TrendingDown}
          className="border-brand-primary-soft hover:shadow-md transition-all duration-300"
        />
        <StatsCard
          title="Platform Charges"
          value={walletLoading ? 'Loading…' : formatCurrency(platformCharges)}
          icon={CreditCard}
          className="border-brand-primary-soft hover:shadow-md transition-all duration-300"
        />
      </div>

      {/* Withdrawal History Section */}
      <Card className="border-brand-primary-soft shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="border-b border-brand-primary-soft bg-brand-surface/50">
          <CardTitle className="text-brand-dark text-xl flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-primary" />
            Withdrawal History
          </CardTitle>
          <p className="text-brand-muted text-sm mt-1">
            Track all your withdrawal requests and their status
          </p>
        </CardHeader>
        
        <CardContent className="p-0">
          {isWithdrawalsLoading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center justify-between p-4 border border-brand-primary-soft rounded-xl">
                    <div className="space-y-2 flex-1">
                      <div className="h-5 bg-brand-primary-soft rounded w-24"></div>
                      <div className="h-4 bg-brand-primary-soft rounded w-32"></div>
                      <div className="h-3 bg-brand-primary-soft rounded w-20"></div>
                    </div>
                    <div className="h-6 bg-brand-primary-soft rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedWithdrawals.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary-soft mb-4">
                <WalletIcon className="h-8 w-8 text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-2">No Withdrawals Yet</h3>
              <p className="text-brand-muted text-sm mb-4">
                Your withdrawal history will appear here once you make a request
              </p>
              <Button 
                variant="outline" 
                className="border-brand-primary text-brand-primary hover:bg-brand-primary-soft"
                onClick={() => setOpen(true)}
              >
                Make Your First Withdrawal
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-brand-primary-soft">
              {paginatedWithdrawals.map((withdrawal) => (
                <div
                  key={withdrawal._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 hover:bg-brand-surface/50 transition-colors duration-200 group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {/* Status Icon Circle */}
                    <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary-soft group-hover:scale-110 transition-transform duration-200">
                      {getStatusIcon(withdrawal.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-semibold text-brand-dark text-base sm:text-lg">
                          {formatCurrency(withdrawal.amount)}
                        </p>
                        <span className="text-xs text-brand-muted">•</span>
                        <p className="text-sm text-brand-muted capitalize">{withdrawal.method}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-brand-dark font-medium">
                          {withdrawal.accountHolderName}
                        </p>
                        <p className="text-xs text-brand-muted">
                          {withdrawal.bankName} • {withdrawal.accountNumber}
                        </p>
                        <p className="text-xs text-brand-muted flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {withdrawal.createdAt ? format(new Date(withdrawal.createdAt), 'PPP') : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 sm:mt-0 flex items-center justify-between sm:justify-end gap-3">
                    <WithdrawalStatusBadge status={withdrawal.status} />
                    
                    {withdrawal.status === WithdrawalStatus.REJECTED && withdrawal.reason && (
                      <div className="relative group">
                        <AlertCircle className="h-4 w-4 text-brand-error cursor-help" />
                        <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-brand-dark text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                          {withdrawal.reason}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-brand-primary-soft px-4 sm:px-6 py-4">
              <Pagination
                meta={{ page, limit, total, totalPages }}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getWithdrawalErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const details = error.details;
    if (Array.isArray(details) && details.length) {
      const first = details[0];
      if (typeof first === 'string' && first.trim()) return first;
      if (first && typeof first === 'object' && 'message' in first) {
        const detailMessage = (first as any).message;
        if (typeof detailMessage === 'string' && detailMessage.trim()) return detailMessage;
      }
    }

    if (typeof details === 'string' && details.trim()) {
      return details;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (typeof error === 'string') return error;

  if (error && typeof error === 'object') {
    const maybeMessage =
      (error as any).message ||
      (error as any).error?.message ||
      (error as any).response?.data?.error?.message ||
      (error as any).response?.data?.message;

    if (maybeMessage) return String(maybeMessage);

    const details = (error as any).details || (error as any).error?.details;
    if (Array.isArray(details) && details.length) {
      const first = details[0];
      if (typeof first === 'string' && first.trim()) return first;
      if (first && typeof first === 'object' && 'message' in first) {
        const detailMessage = (first as any).message;
        if (typeof detailMessage === 'string' && detailMessage.trim()) return detailMessage;
      }
    }
  }

  return 'Insufficient funds or invalid withdrawal amount';
}