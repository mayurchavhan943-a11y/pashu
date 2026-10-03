import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export const Select = forwardRef(({ className, label, error, options = [], ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-critical-500 focus:ring-critical-500",
          className
        )}
        ref={ref}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-critical-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";
