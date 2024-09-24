import qs from 'qs';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { FunctionComponent } from 'react';

import { formatAddress } from '@/helpers/addressFormatter';
import { useNFTTransfer } from '@/providers/nft-transfer';

import { Button } from '@/components/button';
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@vkruglikov/react-telegram-web-app';

type Params = {
	id: string;
};

export const Confirm: FunctionComponent = () => {
	const params = useParams<Params>();
	const navigate = useNavigate();
	const nftTransfer = useNFTTransfer();
	const [searchParams] = useSearchParams();

	const { t } = useTranslation();

	const handleEdit = () => {
		navigate(`/nft/${params.id}/transfer`);
	};

	const handleSend = () => {
		navigate(
			`/nft/${params.id}/pin-code?${qs.stringify({
				addressFrom: searchParams.get('addressFrom'),
				addressTo: searchParams.get('addressTo'),
				network: searchParams.get('network'),
			})}`,
		);
	};

	return (
		<div className={styles['container']}>
			<BackButton onClick={handleEdit} />

			<div className={styles['wrapper']}>
				<div className={styles['detail']}>
					<div className={styles['detail__img']}>
						<img src={nftTransfer.nft.preview_urls?.[3].url} alt={nftTransfer.nft.preview_urls?.[3].resolution} />
					</div>

					<p className={styles['detail__title']}>{nftTransfer.nft.collection_name}</p>
				</div>

				<div className={styles['information']}>
					<div className={styles['information-row']}>
						<span className={styles['information-row__title']}>{t('transfer.confirm.from')}</span>
						<span className={styles['information-row__value']}>{formatAddress(searchParams.get('addressFrom'))}</span>
					</div>

					<div className={styles['information-row']}>
						<span className={styles['information-row__title']}>{t('transfer.confirm.to')}</span>
						<span className={styles['information-row__value']}>{nftTransfer.getShortAddressTo()}</span>
					</div>

					<div className={styles['information-row']}>
						<span className={styles['information-row__title']}>{t('transfer.confirm.network')}</span>
						<span className={styles['information-row__value']}>{nftTransfer.nft.network.toUpperCase()}</span>
					</div>
				</div>
			</div>

			<div className={styles['actions']}>
				<Button theme='secondary' onClick={handleEdit}>
					{t('transfer.edit')}
				</Button>
				<Button onClick={handleSend}>{t('transfer.send')}</Button>
			</div>
		</div>
	);
};
