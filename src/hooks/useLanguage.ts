import { useSettingsStore } from '@/store/useSettingsStore';
import { useAddressStore } from '@/store/addresses';
import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
	const { i18n } = useTranslation();
	const settings = useSettingsStore();

	const selectLanguage = (lang: any) => {
		i18n.changeLanguage(lang.id);
		settings.setLanguage(lang.id);
		useAddressStore.setState({ fiat_currency: lang.id });
	};

	return { selectLanguage, lang: settings.language };
};
