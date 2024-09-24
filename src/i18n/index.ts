import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { useSettingsStore } from '@/store/useSettingsStore';

// Languages
import { enTranslation, ruTranslation } from './translation.ts';

let lang = useSettingsStore.getState().language || 'en';

if (typeof lang !== 'string') {
	lang = 'en';
}

i18n.use(initReactI18next).init({
	resources: {
		en: { translation: enTranslation },
		ru: { translation: ruTranslation },
	},
	lng: lang,
	fallbackLng: lang,
	interpolation: {
		escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
	},
});

export { i18n };
