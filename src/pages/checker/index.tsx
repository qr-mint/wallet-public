import { useTranslation } from 'react-i18next';
import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app';

import { useAccountStore } from '@/store/useAccountStore';
import { PinPad } from '@/components/pin-pad';
import styles from './styles.module.scss';
import { Button } from '@/components/button';
import ExitIcon from '@/assets/icons/fields/exit.svg?react';
import { useNavigate } from 'react-router-dom';

export const Checker = () => {
	const app = useAccountStore();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [impactOccurred] = useHapticFeedback();

	const handleSend = async (value: string, wrong: (err: string) => void) => {
		if (value.length !== 4) return;

		try {
			await app.unlock(value);
		} catch {
			wrong(t('pincode.notify.wrongPincode'));
		}
	};

	const handleExit = () => {
		impactOccurred('medium'); // Vibration

		app.clean();
		navigate('/add-addresses');
	};

	return (
		<div className={styles['wrapper']}>
			<Button onClick={handleExit} className={styles['exit-button']} theme='secondary'>
				<ExitIcon />
			</Button>

			<PinPad onChange={handleSend} title={t('pincode.cheque.title')} />
		</div>
	);
};
