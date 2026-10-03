import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../i18n/LanguageContext';
import { cn } from '../../utils/cn';

export function LanguageSelector({ className, compact = false }) {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 cursor-pointer",
          compact && "px-2 py-1 text-xs"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select global language"
        title="Change language / भाषा बदला"
      >
        <Globe className="h-4 w-4 text-primary-600 shrink-0" />
        <span className="font-medium text-slate-800">
          {activeLang.nativeName}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Available languages"
          className="absolute right-0 z-50 mt-1.5 w-44 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Language / भाषा
          </div>
          {SUPPORTED_LANGUAGES.map((langOption) => {
            const isSelected = langOption.code === language;
            return (
              <button
                key={langOption.code}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelectLanguage(langOption.code)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors text-left cursor-pointer",
                  isSelected
                    ? "bg-primary-50 text-primary-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <span>{langOption.nativeName}</span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-primary-600 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
