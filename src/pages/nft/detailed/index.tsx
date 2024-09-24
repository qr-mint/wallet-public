import { useNavigate } from 'react-router-dom';
import type { FunctionComponent } from 'react';

import { getAssetIcon } from '@/components/home/nft-list/utils';

import { Button } from '@/components/button';
import styles from './styles.module.scss';
import ConfirmedIcon from '@/assets/icons/confirmed.svg?react';
import { useNFTTransfer } from '@/providers/nft-transfer';
import { BackButton } from '@vkruglikov/react-telegram-web-app';

export const DetailedNFT: FunctionComponent = () => {
	const navigate = useNavigate();
	const { nft } = useNFTTransfer();

	const handleSend = () => {
		navigate(`${location.pathname}/transfer`);
	};

	return (
		<div className={styles['container']}>
			<BackButton onClick={() => navigate('/', { state: { navigation: 'nfts' } })} />

			<div className={styles['wrapper']}>
				<div className={styles['poster']}>
					<img src={nft.preview_urls?.[3].url} alt='' />
				</div>

				<div className={styles['information']}>
					<div className={styles['information-asset']}>
						<img src={getAssetIcon(nft.network)} />
					</div>

					<div className={styles['information-header']}>
						<p className={styles['information-header__title']}>{nft.name}</p>

						<div className={styles['information-header__price']}>
							{nft.price} {nft.token_symbol.toUpperCase()}
						</div>
					</div>

					<div className={styles['information-main']}>
						{nft.collection_name && (
							<div className={styles['information-main__user']}>
								<span>{nft.collection_name}</span>

								<ConfirmedIcon />
							</div>
						)}

						<p className={styles['information-main__description']}>{nft.collection_description}</p>
					</div>
				</div>
			</div>

			<div className={styles['actions']}>
				<Button onClick={handleSend} theme='primary' className={styles['actions__send-button']}>
					Send
				</Button>
			</div>
		</div>
	);
};
