import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useErrorBoundary } from 'react-error-boundary';

import { useAddressStore } from '@/store/addresses';
import styles from './page.module.scss';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { Loading } from '@/pages/loading';
import Copy from '@/assets/icons/copy.svg?react';
import { BASE_URL } from '@/config/config';
import { formatAddress } from '../../../helpers/addressFormatter';
import { FooterButton, versions } from '@/components/footer-button';
import { useTranslation } from 'react-i18next';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { notify } from '@/utils/notify';
import { Coin } from '@/store/addresses/types';

export const LetsExachange = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { showBoundary } = useErrorBoundary();
	const { fetchCoins, coins } = useAddressStore();

	useEffect(() => {
		fetchCoins(showBoundary);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleCopy = (address: string) => {
		copyToClipboard(address).then(() => {
			notify({ message: t('notify.success.address.copy'), type: 'success' });
		});
	};

	const _renderCoins = (coins: Coin[]) => {
		const filteredCoins = coins.reduce<Coin[]>((acc, curr) => {
			if (acc.some((item) => item.network === curr.network)) {
				return acc;
			}
			return acc.concat(curr);
		}, []);

		return filteredCoins.map((coin) => (
			<div onClick={() => handleCopy(coin.address)} className={styles['item']} key={coin.id}>
				<div className={`${styles['item__icon']}`}>
					<img width={36} height={36} src={`${BASE_URL}/${coin.imageSource}`} />
				</div>

				<div className={styles['item__address']}>
					<div className={styles['icon']}>
						<Copy />
					</div>

					<p>{formatAddress(coin.address)}</p>
				</div>
			</div>
		));
	};

	if (!coins) {
		return <Loading />;
	}

	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate('/payments/select')} />

			<h1 className={styles['title']}>Lets Exachange</h1>

			<div className={styles['container']}>
				{_renderCoins(coins)}
				<p className=''>{t('payments.letsexachange.copy')}</p>
			</div>

			<div className={styles['actions']}>
				<FooterButton
					text={t('payments.letsexachange.bottonButton.title')}
					version={versions.browser}
					onClick={() => {
						window.open('https://letsexchange.io/v2/widget?affiliate_id=ZVDlskW6lMED7zdU&is_iframe=false', '_blank');
					}}
				/>
			</div>
		</div>
	);
};
