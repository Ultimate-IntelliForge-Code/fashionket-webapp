export const FilterBadge: React.FC<{
  label: string;
  value: string;
  onRemove: () => void;
  color: "blue" | "green" | "purple" | "amber";
}> = ({ label, value, onRemove, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    green: "bg-green-100 text-green-800 hover:bg-green-200",
    purple: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    amber: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  };

  return (
    <div
      className={`inline-flex items-center gap-1 sm:gap-2 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-sm transition-colors ${colorClasses[color]}`}
    >
      <span className="font-medium hidden xs:inline">{label}:</span>
      <span className="truncate max-w-[80px] xs:max-w-[120px] sm:max-w-none">
        {value}
      </span>
      <button
        type="button"
        className="ml-0.5 hover:scale-110 transition-transform p-0.5"
        onClick={onRemove}
      >
        ×
      </button>
    </div>
  );
};
