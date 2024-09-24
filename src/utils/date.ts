import { TFunction } from 'i18next';

export type IColorStatus = 'failed' | 'pending' | 'confirmed';

export const colorStatus = {
	failed: '#FF5454',
	pending: '#8E8E93',
	confirmed: '#39CC83',
};

export function formatDate (datetime: string, t: TFunction<'translation'>) {
	const today = new Date();
	const date = new Date(datetime);

	const isToday = () => {
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	};

	const yesterday = new Date();
	yesterday.setDate(today.getDate() - 1);

	const isYesterday = () => {
		return (
			date.getDate() === yesterday.getDate() &&
			date.getMonth() === yesterday.getMonth() &&
			date.getFullYear() === yesterday.getFullYear()
		);
	};

	const months = [
		t('datetime.month.january'),
		t('datetime.month.february'),
		t('datetime.month.march'),
		t('datetime.month.april'),
		t('datetime.month.may'),
		t('datetime.month.june'),
		t('datetime.month.july'),
		t('datetime.month.august'),
		t('datetime.month.september'),
		t('datetime.month.october'),
		t('datetime.month.november'),
		t('datetime.month.december'),
	];

	if (isToday()) {
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return t('datetime.format.today', { hours, minutes });
	} else if (isYesterday()) {
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return t('datetime.format.yesterday', { hours, minutes });
	} else {
		const day = date.getDate();
		const month = months[date.getMonth()];
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return t('datetime.format.month', { day, month, hours, minutes });
	}
}

