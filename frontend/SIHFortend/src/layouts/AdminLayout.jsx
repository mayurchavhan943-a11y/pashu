import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, List, Activity, FileText, Stethoscope, Calendar, Bell, BarChart2, Settings, UserCircle } from "lucide-react";
import { Logo } from "../components/common/Logo";
import { LanguageSelector } from "../components/common/LanguageSelector";
import { cn } from "../utils/cn";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Animals", href: "/admin/animals", icon: List },
  { name: "Diseases", href: "/admin/diseases", icon: Activity },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Veterinarians", href: "/admin/veterinarians", icon: Stethoscope },
  { name: "Appointments", href: "/admin/appointments", icon: Calendar },
  { name: "Alerts", href: "/admin/alerts", icon: Bell },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-slate-900 text-slate-300 px-4 py-6">
        <div className="flex items-center gap-2 px-2 mb-8 text-white">
          <Logo className="h-8 w-8 text-primary-500" />
          <span className="text-xl font-bold">Pashu Care</span>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto hide-scrollbar pb-4">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-600 text-white"
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 max-w-full">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 shrink-0 shadow-sm">
           <h2 className="text-lg font-semibold text-slate-800">Admin Area</h2>
           <div className="flex items-center gap-4">
             <LanguageSelector />
             <Bell className="h-5 w-5 text-slate-500 cursor-pointer" />
             <UserCircle className="h-8 w-8 text-slate-400 cursor-pointer" />
           </div>
        </header>
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
