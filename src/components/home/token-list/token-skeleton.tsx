import styles from './token.module.scss';
import type { FunctionComponent } from 'react';
import type { TokenSkeletonProps } from './types';

export const TokenSkeleton: FunctionComponent<TokenSkeletonProps> = ({ count }) => {
	return [...Array(count)].map((_, key) => (
		<div key={key} className={styles['token-skeleton']}>
			<div className={styles['token-skeleton__image']}></div>

			<p className={styles['token-skeleton__name']}></p>
			<p className={styles['token-skeleton__stock']}></p>

			<div className={styles['token-skeleton__fiat']}>
				<svg className={styles['token-skeleton__icon']}>
					<rect width={'100%'} height={'100%'} />
				</svg>
			</div>

			<div className={styles['token-skeleton__crypto']}>
				<svg className={styles['token-skeleton__icon']}>
					<rect width={'100%'} height={'100%'} />
				</svg>
			</div>
		</div>
	));
};
