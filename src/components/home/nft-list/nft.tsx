import type { FunctionComponent } from 'react';

import { getAssetIcon } from './utils';
import styles from './nft.module.scss';
import type { NFTProps } from './types';

export const NFT: FunctionComponent<NFTProps> = ({ nft, ...rest }) => {
	return (
		<div className={styles['nft']} {...rest}>
			<img src={nft.preview_urls[2].url} alt='' className={styles['nft__image']} />
			<p className={styles['nft__price']}>
				{nft.price} {nft.token_symbol.toUpperCase()}
			</p>
			<img src={getAssetIcon(nft.network)} alt='' className={styles['nft__currency']} />
		</div>
	);
};
