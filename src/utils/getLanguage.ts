export function getLanguage (language: string) {
	if (language === 'ru')
		return {
			id: 'ru',
			label: 'Русский',
		};

	return {
		id: 'en',
		label: 'English',
	};
}
