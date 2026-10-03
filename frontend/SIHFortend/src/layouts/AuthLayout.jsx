import { Outlet } from "react-router-dom";
import { Logo } from "../components/common/Logo";
import { LanguageSelector } from "../components/common/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";

export function AuthLayout() {
  const { t } = useLanguage();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Top-Right Language Selector on Auth Pages */}
      <div className="absolute top-4 right-4 z-10 sm:top-6 sm:right-8">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-primary-100 p-3 mb-4 text-primary-600">
            <Logo className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {t('app.name', 'Pashu Care')}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t('app.tagline', 'Smart Animal Healthcare, Anytime.')}
          </p>
        </div>
        
        <Outlet />
      </div>
    </div>
  );
}
