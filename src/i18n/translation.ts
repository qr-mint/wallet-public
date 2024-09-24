import _enTranslation from './en/translation.json';
import _ruTranslation from './ru/translation.json';
import swapTranslation from '../pages/swap/translation.ts';

export const enTranslation = {
	..._enTranslation,
	...swapTranslation.en
};

export const ruTranslation = {
	..._ruTranslation,
	...swapTranslation.ru
};