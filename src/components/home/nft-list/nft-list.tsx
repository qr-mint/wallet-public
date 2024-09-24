import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app';
import { useEffect, useState } from 'react';
import type { FunctionComponent } from 'react';

import { NFT } from './nft';
import { NFTSkeleton } from './nft-skeleton';
import { Loading, colors } from '@/components/loading';
import styles from './nft.module.scss';
import type { NFTItem } from '@/api/nft/types';
import type { NFTListProps } from './types';

export const NFTList: FunctionComponent<NFTListProps> = ({ noMore, loading, fetching, className, nftList }) => {
	const navigate = useNavigate();
	const [impactOccurred] = useHapticFeedback();
	const { t } = useTranslation();

	const [ delay, setDelay ] = useState<boolean>(true);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setDelay(false);
		}, 300);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	const _renderNfts = (nfts: NFTItem[]) => {
		const handleClick = (id: number) => {
			impactOccurred('medium');
			navigate(`/nft/${id}`);
		};

		if (loading || delay) {
			return <NFTSkeleton count={9} />;
		} else if (!nfts || nfts.length === 0) {
			return <p className={styles['nft-list__title']}>{t('nfts.error.not-found')}</p>;
		}
		return nfts.map((nft, key) => <NFT onClick={() => handleClick(nft.id)} nft={nft} key={key} />);
	};

	const _renderLoading = () => {
		if ((!nftList || nftList.length !== 0) && fetching && !noMore) {
			return <Loading color={colors.blue} className={styles['nft-list__loading']} />;
		}
	};

	const _renderNoMore = () => {
		if ((!nftList || nftList.length !== 0) && noMore) {
			return <p className={styles['nft-list__title']}>{t('nfts.error.no-more')}</p>;
		}
	};

	return (
		<div className={cn(styles['nft-list'], className)}>
			{_renderNfts(nftList)}
			{_renderLoading()}
			{_renderNoMore()}
		</div>
	);
};
