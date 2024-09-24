import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useErrorBoundary } from 'react-error-boundary';

import styles from './index.module.scss';
import SuccessIcon from '@/assets/icons/success-circled-gray.svg?react';
import { Button } from '@/components/button';
import { useSwapStore } from '@/store/swap';
import { useAddressStore } from '@/store/addresses';

export const SwapSuccessPage = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { showBoundary } = useErrorBoundary();

	const fetchCoins = useAddressStore(state => state.fetchCoins);

	const toCoin = useSwapStore(state => state.toCoin);

	const toValue = useSwapStore(state => state.toValue);

	const resetStore = useSwapStore(state => state.resetStore);

	const handleBack = (): void => {
		resetStore();
		fetchCoins(showBoundary);
		navigate('/');
	};

	return (
		<div className={styles['success']}>
			<div className={styles['success__icon']}>
				<SuccessIcon className={styles['svg']} />
			</div>
			<div className={styles['success__title']}>
				{toValue} {toCoin?.symbol}
			</div>
			<div className={styles['success__subtitle']}>
				{t('swapSuccessMessage')}
			</div>

			<div className={styles['actions']}>
				<Button
					onClick={handleBack}
					className={styles['button']}
				>
					{t('swapHome')}
				</Button>
			</div>
		</div>
	);
};
