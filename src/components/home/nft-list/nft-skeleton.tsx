import styles from './nft.module.scss';
import type { NFTSkeletonProps } from './types';
import type { FunctionComponent } from 'react';

export const NFTSkeleton: FunctionComponent<NFTSkeletonProps> = ({ count }) => {
	return [...Array(count)].map((_, key) => (
		<div key={key} className={styles['nft-skeleton']}>
			<svg>
				<rect width={'100%'} height={'100%'} />
			</svg>
		</div>
	));
};
