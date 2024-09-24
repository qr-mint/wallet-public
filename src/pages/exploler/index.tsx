import { useNavigate, useSearchParams } from 'react-router-dom';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import type { FunctionComponent } from 'react';

import styles from './styles.module.scss';
import { useErrorBoundary } from 'react-error-boundary';

export const Exploler: FunctionComponent = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { showBoundary } = useErrorBoundary();
	const source = searchParams.get('source');
	const prevURL = searchParams.get('prevURL');

	if (!source || !prevURL) {
		showBoundary({ message: 'Source or Previous URL was not found!', status: 404 });
		return <></>;
	}

	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate(prevURL)} />

			<iframe src={decodeURIComponent(source)} width='100%' height='100%' frameBorder={0} allow='clipboard-read; clipboard-write' />
		</div>
	);
};
