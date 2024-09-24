import qs from 'qs';
import { useTranslation } from 'react-i18next';
import { useErrorBoundary } from 'react-error-boundary';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackButton, useHapticFeedback, useScanQrPopup } from '@vkruglikov/react-telegram-web-app';
import type { FunctionComponent } from 'react';

import { notify } from '@/utils/notify';
import { useNFTTransfer } from '@/providers/nft-transfer';
import { useAddressStore } from '@/store/addresses';

import { Button } from '@/components/button';
import styles from './styles.module.scss';
import QRIcon from '@/assets/icons/fields/qr.svg?react';

type Params = {
	id: string;
};

export const Transfer: FunctionComponent = () => {
	const params = useParams<Params>();
	const navigate = useNavigate();
	const nftTransfer = useNFTTransfer();
	const [ show, close ] = useScanQrPopup();
	const [impactOccurred] = useHapticFeedback();

	const { t } = useTranslation();
	const { showBoundary } = useErrorBoundary();
	const { coins, fetchCoins } = useAddressStore();

	const [ address, setAddress ] = useState<string>('');
	const [ addressFrom, setAddressFrom ] = useState<string>('');

	const handleScan = () => {
		impactOccurred('medium');

		try {
			show({ text: t('transfer.qr-code') }, (value) => {
				if (!value) return;
				setAddress(value);
				close();
			});
		} catch (error) {
			console.error(error);
			notify({ type: 'error', message: t('transfer.address.qr.error') });
		}
	};

	const getAddressFrom = async () => {
		if (coins.length === 0) {
			await fetchCoins();
		}

		const coin = coins.find((item) => item.network === nftTransfer.nft.network);
		const address = coin?.address;
		
		if (address) {
			setAddressFrom(address);
		}
	};

	const handleSend = () => {
		impactOccurred('medium');

		if (!params.id) {
			return showBoundary({ status: 404 });
		}

		const validation = nftTransfer.validateAddress(address, t);

		if (validation) {
			return notify({ type: 'error', message: validation, position: 'top-right' });
		}

		navigate(
			`/nft/${params.id}/confirm?${qs.stringify({
				addressFrom: addressFrom,
				addressTo: address,
				network: nftTransfer.nft.network,
			})}`,
		);
	};

	useEffect(() => {
		getAddressFrom();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={styles['container']}>
			<BackButton onClick={() => navigate(`/nft/${params.id}`)}/>
				
			<div className={styles['wrapper']}>
				<div className={styles['poster']}>
					<img src={nftTransfer.nft.preview_urls?.[3].url} alt='' />
				</div>

				<div className={styles['information']}>
					<p className={styles['information__name']}>{nftTransfer.nft.collection_name}</p>

					<form onSubmit={handleSend} className={styles['information__field']}>
						<input
							type='text'
							placeholder={t('nft.transfer.field')}
							value={address}
							onChange={({ target: { value } }) => setAddress(value)}
							className={styles['information__field-input']}
							required
						/>

						<button type='button' onClick={handleScan} className={styles['information__field-scan']}>
							<QRIcon />
						</button>
					</form>
				</div>
			</div>

			<div className={styles['actions']}>
				<Button theme='primary' className={styles['actions__send-button']} onClick={handleSend}>
					{t('nft.transfer.send')}
				</Button>
			</div>
		</div>
	);
};
