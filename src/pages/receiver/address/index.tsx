import QRCode from 'react-qr-code';
import { useEffect, useState } from 'react';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { notify } from '@/utils/notify';
import { Button } from '@/components/button';
import { BASE_URL } from '@/config/config';
import { useTokenInfo } from '@/store/token/useTokenInfo';
import { copyToClipboard } from '@/utils/copyToClipboard';
import styles from './styles.module.scss';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react';
import { Loading } from '@/pages/loading';
import { useErrorBoundary } from 'react-error-boundary';

export const Address = () => {
	const { showBoundary } = useErrorBoundary();
	const params: any = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const { t } = useTranslation();
	const { tokenInfo, loadTokenInfo } = useTokenInfo();
	const [ isLoading, setIsLoading ] = useState<boolean>(true);

	useEffect(() => {
		setIsLoading(true);

		loadTokenInfo(params.network)
			.catch((error) => {
				if (error.status >= 500) {
					showBoundary(error);
				}
				navigate('/receiver');
			})
			.finally(() => {
				setIsLoading(false);
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadTokenInfo]);

	const handleCopy = (address: string) => {
		copyToClipboard(address).then(() => {
			notify({ message: t('notify.success.address.copy'), type: 'success' });
		});
	};

	const handleShare = async (address: string) => {
		try {
			await navigator.share({ text: address });
		} catch (error) {
			console.error(t('notify.error.address.share'), error);
		}
	};

	const _renderShareButton = (address: string) => {
		if (!navigator.share) return;
		return (
			<Button className={styles['actions__button']} onClick={() => handleShare(address)} theme='secondary'>
				{t('received.button.share')}
			</Button>
		);
	};

	const _renderQrCode = (address: string) => {
		return <QRCode value={address} />;
	};

	if (isLoading) {
		return (
			<div className='container-loading'>
				<Loading />
			</div>
		);
	}

	if (!tokenInfo) {
		showBoundary({ error: { status: 503 } });
		return <></>;
	}

	return (
		<div className={styles['wrapper']}>
			<BackButton
				onClick={() => {
					const prevURL = searchParams.get('prevURL');
					navigate(prevURL ? prevURL : '/receiver');
				}}
			/>

			<div className={styles['main']}>
				<div className={styles['main__qr']}>{_renderQrCode(tokenInfo.address)}</div>
				<div className={styles['main__title']}>
					<img src={`${BASE_URL}/${tokenInfo.imageSource}`} alt='' />
					<p>{tokenInfo.symbol}</p>
				</div>

				<p className={styles['main__subtitle']}>{t('received.address.subtitle', { network: tokenInfo.symbol })}</p>
			</div>

			<div className={styles['information']}>
				<div onClick={() => navigate('/receiver')} className={styles['information__item']}>
					<span> {tokenInfo.symbol}</span>
					<ChevronRightIcon />
				</div>

				<div className={styles['information__item']}>
					<span>{tokenInfo.address}</span>
					<span>{t('received.address.network', { network: tokenInfo.network.toUpperCase() })}</span>
				</div>
			</div>

			<div className={styles['actions']}>
				{_renderShareButton(tokenInfo.address)}
				<Button className={styles['actions__button']} onClick={() => handleCopy(tokenInfo.address)}>
					{t('received.button.copy')}
				</Button>
			</div>
		</div>
	);
};
