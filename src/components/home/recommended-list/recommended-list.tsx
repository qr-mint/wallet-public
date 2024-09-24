import cn from 'classnames';
import { useEffect, useState, type FunctionComponent } from 'react';

import { Recommended } from './recommended';
import styles from './recommended.module.scss';
import { RecommendedSkeleton } from './recommended-skeleton';

interface RecommendedListProps {
	recommendedList: {
		imageSource: string;
		title: string;
		subtitle: string;
		link: string;
	}[];
}

export const RecommendedList: FunctionComponent<RecommendedListProps> = ({ recommendedList }) => {
	const [ delay, setDelay ] = useState<boolean>(true);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setDelay(false);
		}, 300);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	const _renderTransactions = () => {
		if (delay) {
			return <RecommendedSkeleton count={6}/>; 
		}
		return recommendedList.map((recommended, key) => <Recommended recommended={recommended} key={key} />);
	};

	return (
		<div className={cn(styles['recommended-list'])}>
			{_renderTransactions()}
		</div>
	);
};
