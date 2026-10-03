import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, FileText, Bell, MessageSquare, UserCircle, Stethoscope } from "lucide-react";
import { Logo } from "../components/common/Logo";
import { LanguageSelector } from "../components/common/LanguageSelector";
import { cn } from "../utils/cn";

const navigation = [
  { name: "Dashboard", href: "/vet/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/vet/patients", icon: Users },
  { name: "Appointments", href: "/vet/appointments", icon: Calendar },
  { name: "Health Reports", href: "/vet/reports", icon: FileText },
  { name: "Alerts", href: "/vet/alerts", icon: Bell },
  { name: "Messages", href: "/vet/messages", icon: MessageSquare },
  { name: "Profile", href: "/vet/profile", icon: UserCircle },
];

export function VetLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white px-4 py-6">
        <div className="flex items-center gap-2 px-2 mb-8">
          <Logo className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold text-slate-900">Pashu Care</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary-600" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 max-w-full">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 shrink-0 shadow-sm">
           <h2 className="text-lg font-semibold text-slate-800">Veterinarian Dashboard</h2>
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
