import { useLocation, useNavigate, useParams, Params } from 'react-router-dom';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.scss';
import { useTransfer } from '@/providers/transfer/hooks';
import { formatAddress } from '@/helpers/addressFormatter';
import { FooterButton } from '@/components/footer-button';
import { Loading } from '@/components/loading';

export function Confirm () {
	const params = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const transfer = useTransfer();
	const { t } = useTranslation();

	const handleSend = (params: Params<string>) => {
		navigate(`/transfer/pin-code/${params.network}${location.search}`);
	};

	if (!transfer.wallet) {
		return (
			<div className="container-loading">
				<Loading />
			</div>
		);
	}

	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate(-1)} />
			<div className={styles['coins']}>
				<div className={styles['coins__item']}>
					<div className={styles['coins__image']}>
						<img src={transfer.coinLogo} alt='' />
					</div>

					<p className={styles['coins__title']}>{t('transfer.confirm.total')}</p>
					<p className={styles['coins__amount']}>{transfer.getAmountLabel()}</p>
				</div>
			</div>

			<div className={styles['information']}>
				<div className={styles['information-row']}>
					<span className={styles['information-row__title']}>{t('transfer.confirm.from')}</span>
					<span className={styles['information-row__value']}>{formatAddress(transfer.wallet.address)}</span>
				</div>

				<div className={styles['information-row']}>
					<span className={styles['information-row__title']}>{t('transfer.confirm.to')}</span>
					<span className={styles['information-row__value']}>{transfer.getShortAddress()}</span>
				</div>

				<div className={styles['information-row']}>
					<span className={styles['information-row__title']}>{t('transfer.confirm.network')}</span>
					<span className={styles['information-row__value']}>{transfer.wallet.symbol}</span>
				</div>
			</div>

			<div className={styles['actions']}>
				<FooterButton text={t('transfer.send')} onClick={() => handleSend(params)} />
			</div>
		</div>
	);
}
