import { WithdrawalStatus } from '@/types';
import { cn } from '@/lib/utils';

const statusStyles: Record<WithdrawalStatus, string> = {
  [WithdrawalStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [WithdrawalStatus.APPROVED]: 'bg-blue-100 text-blue-800',
  [WithdrawalStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [WithdrawalStatus.REJECTED]: 'bg-red-100 text-red-800',
};

interface Props {
  status: WithdrawalStatus;
}

export const WithdrawalStatusBadge = ({ status }: Props) => (
  <span
    className={cn(
      'px-3 py-1 rounded-full text-xs font-medium capitalize',
      statusStyles[status] || 'bg-gray-100 text-gray-800',
    )}
  >
    {status.toLowerCase()}
  </span>
);
