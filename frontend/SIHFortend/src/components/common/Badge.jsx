import { cn } from "../../utils/cn";

export function Badge({ children, variant = "default", className }) {
  const variants = {
    default: "bg-slate-100 text-slate-800",
    primary: "bg-primary-100 text-primary-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-warning-100 text-warning-800",
    critical: "bg-critical-100 text-critical-800",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", variants[variant], className)}>
      {children}
    </span>
  );
}
