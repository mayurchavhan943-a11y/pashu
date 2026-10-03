import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, List, PlusCircle, Activity, HeartPulse, UserCircle, Map } from "lucide-react";
import { Logo } from "../components/common/Logo";
import { LanguageSelector } from "../components/common/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import { cn } from "../utils/cn";

const navigationItems = [
  { key: "nav.dashboard", name: "Dashboard", href: "/dashboard", icon: Home },
  { key: "nav.animals", name: "Animals", href: "/animals", icon: List },
  { key: "nav.add", name: "Add", href: "/add-animal", icon: PlusCircle },
  { key: "nav.health", name: "Health", href: "/health-check", icon: HeartPulse },
  { key: "nav.history", name: "History", href: "/history", icon: Activity },
  { key: "nav.riskMap", name: "Risk Map", href: "/risk-map", icon: Map },
  { key: "nav.riskAnalysis", name: "Risk Analysis", href: "/risk-analysis", icon: Activity },
];

export function MainLayout() {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 shrink-0">
        <div className="flex items-center gap-2 px-2 mb-8">
          <Logo className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold text-slate-900">{t('app.name', 'Pashu Care')}</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            const label = t(item.key, item.name);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary-600" : "text-slate-400")} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="pt-6 border-t border-slate-200 mt-auto">
          <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">
            <UserCircle className="h-5 w-5 text-slate-400" />
            <span>{t('nav.profile', 'Profile')}</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-full min-w-0">
        {/* Desktop Header with Top-Right Global Language Selector */}
        <header className="hidden md:flex items-center justify-between border-b border-slate-200 bg-white px-8 py-3.5 shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">
              {t('app.tagline', 'Smart Animal Healthcare, Anytime.')}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Link to="/profile" className="text-slate-500 hover:text-slate-700 transition-colors" title={t('nav.profile', 'Profile')}>
              <UserCircle className="h-8 w-8 text-slate-400 hover:text-slate-600" />
            </Link>
          </div>
        </header>

        {/* Mobile Header with Top-Right Global Language Selector */}
        <header className="md:hidden flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 shrink-0">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-bold text-slate-900">{t('app.name', 'Pashu Care')}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector compact />
            <Link to="/profile">
              <UserCircle className="h-6 w-6 text-slate-600" />
            </Link>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-200 bg-white pb-safe pt-2 px-2 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
        {navigationItems.slice(0, 5).map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          const label = t(item.key, item.name);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 min-w-[64px]",
                isActive ? "text-primary-700" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-primary-600" : "")} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
