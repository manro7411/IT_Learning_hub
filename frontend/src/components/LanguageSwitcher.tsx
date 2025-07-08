import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChangeLanguage = (lang: 'en' | 'th') => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={() => handleChangeLanguage('en')}
        className={`px-4 py-2 rounded ${
          i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleChangeLanguage('th')}
        className={`px-4 py-2 rounded ${
          i18n.language === 'th' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        TH
      </button>
    </div>
  );
};

export default LanguageSwitcher;
