import type { FunctionComponent } from 'react';
import styles from './recommended.module.scss';

interface RecommendedProps {
	recommended: {
		imageSource: string;
		title: string;
		subtitle: string;
		link: string;
	};
}

export const Recommended: FunctionComponent<RecommendedProps> = ({ recommended }) => {
	return (
		<a target='_blank' href={recommended.link} className={styles['recommended']}>
			<div className={styles['recommended__image']}>
				<img src={recommended.imageSource} alt='' />
			</div>

			<p className={styles['recommended__title']}>{recommended.title}</p>
			<p className={styles['recommended__subtitle']}>{recommended.subtitle}</p>
		</a>
	);
};
