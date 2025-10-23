import { StatusProduto } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: StatusProduto;
  showLabel?: boolean;
}

const statusConfig = {
  critical: {
    label: 'Crítico',
    className: 'bg-status-critical/10 text-status-critical border-status-critical',
    dotClassName: 'bg-status-critical',
  },
  warning: {
    label: 'Atenção',
    className: 'bg-status-warning/10 text-status-warning border-status-warning',
    dotClassName: 'bg-status-warning',
  },
  success: {
    label: 'OK',
    className: 'bg-status-success/10 text-status-success border-status-success',
    dotClassName: 'bg-status-success',
  },
};

export const StatusBadge = ({ status, showLabel = false }: StatusBadgeProps) => {
  const config = statusConfig[status];

  if (!showLabel) {
    return (
      <div className="flex items-center justify-center">
        <div className={cn('w-3 h-3 rounded-full', config.dotClassName)} />
      </div>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border',
        config.className
      )}
    >
      <div className={cn('w-2 h-2 rounded-full', config.dotClassName)} />
      {config.label}
    </span>
  );
};
