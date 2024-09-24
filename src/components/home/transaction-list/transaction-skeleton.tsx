import type { FunctionComponent } from 'react';
import styles from './transaction.module.scss';

export const TransactionSkeleton: FunctionComponent<{ count?: number }> = ({ count = 1 }) => {
	return [...Array(count)].map((_, key) => (
		<div key={key} className={styles['transaction-skeleton']}>
			<svg className={styles['transaction-skeleton__icon']}>
				<rect width={'100%'} height={'100%'} />
			</svg>

			<p className={styles['transaction-skeleton__name']} />
			<p className={styles['transaction-skeleton__datetime']} />

			<div className={styles['transaction-skeleton__amount']}>
				<svg className={styles['transaction-skeleton__image']}>
					<rect width={'100%'} height={'100%'} />
				</svg>
			</div>

			<div className={styles['transaction-skeleton__status']}>
				<svg className={styles['transaction-skeleton__image']}>
					<rect width={'100%'} height={'100%'} />
				</svg>
			</div>
		</div>
	));
};
