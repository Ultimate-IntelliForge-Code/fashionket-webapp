import { X } from "lucide-react";

export const FilterBadge: React.FC<{
  label: string;
  value: string;
  onRemove: () => void;
  color: "blue" | "green" | "purple" | "amber" | "yellow";
}> = ({ label, value, onRemove, color }) => {
  const colorClasses = {
    blue: "bg-brand-primary-soft text-brand-primary hover:bg-brand-primary-soft/80",
    green: "bg-brand-success/10 text-brand-success hover:bg-brand-success/20",
    purple: "bg-brand-primary-soft text-brand-primary hover:bg-brand-primary-soft/80",
    amber: "bg-brand-warning/10 text-brand-warning hover:bg-brand-warning/20",
    yellow: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  };

  // Alternative: Using theme tokens for yellow if you add to your brand system
  // If you add --color-brand-yellow: #eab308; to your theme, you can use:
  // yellow: "bg-brand-yellow/10 text-brand-yellow hover:bg-brand-yellow/20",

  return (
    <div
      className={`inline-flex items-center gap-1 sm:gap-2 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-sm font-medium transition-all duration-200 ${colorClasses[color]}`}
    >
      <span className="hidden xs:inline">{label}:</span>
      <span className="truncate max-w-[80px] xs:max-w-[120px] sm:max-w-[150px] md:max-w-none">
        {value}
      </span>
      <button
        type="button"
        className="ml-0.5 hover:scale-110 transition-transform p-0.5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current"
        onClick={onRemove}
        aria-label={`Remove ${label} filter: ${value}`}
      >
        <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      </button>
    </div>
  );
};