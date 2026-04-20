import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'es', label: 'ES', name: 'Español' },
    { code: 'fr', label: 'FR', name: 'Français' },
    { code: 'de', label: 'DE', name: 'Deutsch' },
    { code: 'ja', label: 'JA', name: '日本語' },
  ];
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-text-dim text-sm hidden md:inline">Language:</span>
      <div className="flex space-x-1 bg-surface border border-border rounded-md p-1">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              i18n.language === lang.code 
                ? 'bg-accent text-primary-foreground' 
                : 'text-text-dim hover:text-text'
            }`}
            aria-label={`Switch to ${lang.name}`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}