import { Card, CardContent } from "./Card";
import { cn } from "../../utils/cn";

export function StatCard({ title, value, icon: Icon, trend, trendValue, color = "primary" }) {
  const colorMap = {
    primary: "bg-primary-50 text-primary-600",
    success: "bg-green-50 text-green-600",
    warning: "bg-warning-50 text-warning-600",
    critical: "bg-critical-50 text-critical-600",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h4 className="mt-1 text-3xl font-bold text-slate-900">{value}</h4>
          </div>
          {Icon && (
            <div className={cn("rounded-full p-3", colorMap[color])}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span className={cn("font-medium", trend === "up" ? "text-green-600" : "text-critical-600")}>
              {trendValue}
            </span>
            <span className="ml-2 text-slate-500">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
