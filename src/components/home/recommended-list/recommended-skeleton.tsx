import type { FunctionComponent } from 'react';
import styles from './recommended.module.scss';

export const RecommendedSkeleton: FunctionComponent<{ count?: number }> = ({ count = 1 }) => {
	return [...Array(count)].map((_, key) => (
		<div key={key} className={styles['recommended-skeleton']}>
			<svg className={styles['recommended-skeleton__icon']}>
				<rect width={'100%'} height={'100%'} />
			</svg>

			<p className={styles['recommended-skeleton__name']} />
			<p className={styles['recommended-skeleton__datetime']} />

		</div>
	));
};
