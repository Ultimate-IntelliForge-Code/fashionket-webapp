
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
import { DollarSign, TrendingDown, Wallet as WalletIcon, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { Pagination } from '@/components/ui/pagination';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { StatsCard } from '@/components/ui/stats-card';
import { WithdrawalFormData, withdrawalSchema } from '@/lib';
import { useWalletStatsQuery, useWithdrawalsQuery, useRequestWithdrawalMutation } from '@/api/hooks/wallet.hook';
import { WithdrawalStatusBadge } from '../../../../components/wallet/withdrawal-status-badge';

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
      toast.error(error.message || 'Failed to submit withdrawal request');
    }
  };

  const totalPages = withdrawalsData?.pagination.totalPages ?? 1;
  const total = withdrawalsData?.pagination.total ?? 0;
  const paginatedWithdrawals = withdrawalsData?.items ?? [];
  const isWithdrawalsLoading = withdrawalsLoading || withdrawalsFetching;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-mmp-primary hover:bg-mmp-primary2">
              Request Withdrawal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle>Withdrawal Request</DialogTitle>
              <DialogDescription>
                Enter your bank details and amount to withdraw
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <Input
                  id="accountHolderName"
                  {...register('accountHolderName')}
                  placeholder="John Doe"
                />
                {errors.accountHolderName && (
                  <p className="text-sm text-red-600 mt-1">{errors.accountHolderName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  {...register('bankName')}
                  placeholder="Access Bank"
                />
                {errors.bankName && (
                  <p className="text-sm text-red-600 mt-1">{errors.bankName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  {...register('accountNumber')}
                  placeholder="0123456789"
                />
                {errors.accountNumber && (
                  <p className="text-sm text-red-600 mt-1">{errors.accountNumber.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  {...register('amount', { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.amount && (
                  <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  Available balance: {formatCurrency(balance)}
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-mmp-primary hover:bg-mmp-primary2"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 md:gap-3">
        <StatsCard
          title="Net Profit"
          value={walletLoading ? 'Loading…' : formatCurrency(netProfit)}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Available Balance"
          value={walletLoading ? 'Loading…' : formatCurrency(balance)}
          icon={WalletIcon}
        />
        <StatsCard
          title="Total Withdrawals"
          value={walletLoading ? 'Loading…' : formatCurrency(totalWithdrawals)}
          icon={TrendingDown}
        />
        <StatsCard
          title="Platform Charges"
          value={walletLoading ? 'Loading…' : formatCurrency(platformCharges)}
          icon={CreditCard}
        />
      </div>

      {/* Withdrawal History */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isWithdrawalsLoading ? (
              <p className="text-sm text-gray-600">Loading withdrawals...</p>
            ) : paginatedWithdrawals.length === 0 ? (
              <p className="text-sm text-gray-600">No withdrawals yet.</p>
            ) : (
              paginatedWithdrawals.map((withdrawal) => (
                <div
                  key={withdrawal._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{formatCurrency(withdrawal.amount)}</p>
                    <p className="text-sm text-gray-600">{withdrawal.method}</p>
                    <p className="text-xs text-gray-500">
                      {withdrawal.createdAt ? format(new Date(withdrawal.createdAt), 'PPP') : ''}
                    </p>
                  </div>
                  <div>
                    <WithdrawalStatusBadge status={withdrawal.status} />
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
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