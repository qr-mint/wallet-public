import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useErrorBoundary } from 'react-error-boundary';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';

import { BackButton } from '@vkruglikov/react-telegram-web-app';

import { notify } from '@/utils/notify';
import { methods } from '../const';
import { useTokenInfo } from '@/store/token';
import { formatAddress } from '@/helpers/addressFormatter';
import { copyToClipboard } from '@/utils/copyToClipboard';

import styles from './page.module.scss';
import Copy from '@/assets/icons/copy.svg?react';
import BankIcon from '@/assets/icons/action-button/bank.svg?react';

export const Payment = () => {
	const iframeRef = useRef(null);
	const params = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { showBoundary } = useErrorBoundary();
	const { loadTokenInfo, tokenInfo } = useTokenInfo();
	const [searchParams] = useSearchParams();
	const method = methods.find((method) => method.key === params.methodName);

	useEffect(() => {
		if (!method) {
			showBoundary({ message: 'Method was not found!', status: 404 });
		}
	}, [ method, showBoundary ]);

	useEffect(() => {
		if (params.network) {
			loadTokenInfo(params.network)
				.catch((err) => {
					showBoundary(err);
				});
		}
	}, [ loadTokenInfo, params, showBoundary ]);

	const handleCopy = (address: string) => {
		copyToClipboard(address)
			.then(() => {
				notify({ message: t('notify.success.address.copy'), type: 'success' });
			});
	};

	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate(`/payments/amount/${params.methodName}/${params.network}`)} />

			<div className={styles['wallet']}>
				<div className={styles['wallet__image']}>
					<BankIcon />
				</div>

				<div className={styles['wallet__info']}>
					<p className={styles['wallet__name']}>{method?.name}</p>
					<p className={styles['wallet__balance']}>{method?.name}</p>
				</div>

				<div className={styles['nav__right']}>
					<div onClick={() => handleCopy(tokenInfo.address)} className={styles.copy}>
						<Copy />
					</div>

					{formatAddress(tokenInfo.address)}
				</div>
			</div>

			<iframe
				ref={iframeRef}
				src={decodeURIComponent(method?.widget || searchParams.get('source') || '')}
				width="100%" height="100%"
				allow="clipboard-read; clipboard-write"
			/>
		</div>
	);
};
