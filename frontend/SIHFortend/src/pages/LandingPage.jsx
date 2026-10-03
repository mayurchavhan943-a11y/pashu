import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import { CheckCircle, Activity, Stethoscope } from "lucide-react";
import { Logo } from "../components/common/Logo";
import { LanguageSelector } from "../components/common/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar with Global Top-Right Language Selector */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-slate-900">{t('app.name', 'Pashu Care')}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSelector />
            <button 
              onClick={() => navigate('/login')} 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {t('nav.login', 'Log in')}
            </button>
            <Button onClick={() => navigate('/register')}>
              {t('nav.signup', 'Sign up')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 lg:py-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <Badge className="mb-6 bg-primary-100 text-primary-800 border-none">
            {t('landing.badge', 'AI-Powered Health Support for Every Animal')}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto">
            {t('landing.heroTitle', 'Smart Animal Healthcare,')}{' '}
            <span className="text-primary-600">{t('landing.heroHighlight', 'Anytime.')}</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            {t('landing.heroDesc', "Understand your animal's health, monitor symptoms, and connect with veterinarians using intelligent health assistance.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Button size="lg" onClick={() => navigate('/register')}>
              {t('landing.startCheckCta', 'Start Your Animal Health Check')}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
              {t('landing.findVetCta', 'Find Veterinarian')}
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">
              {t('landing.whyChooseTitle', 'Why choose Pashu Care?')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t('landing.feature1Title', 'AI Health Assessment')}
              </h3>
              <p className="text-slate-600">
                {t('landing.feature1Desc', 'Instantly analyze symptoms and receive an intelligent preliminary health assessment.')}
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t('landing.feature2Title', 'Early Disease Detection')}
              </h3>
              <p className="text-slate-600">
                {t('landing.feature2Desc', 'Detect potential outbreaks and regional risks before they spread across herds.')}
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t('landing.feature3Title', 'Veterinary Network')}
              </h3>
              <p className="text-slate-600">
                {t('landing.feature3Desc', 'Connect with qualified veterinary doctors and clinic facilities near your location.')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
