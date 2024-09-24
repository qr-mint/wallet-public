import { useTranslation } from 'react-i18next';
import { useErrorBoundary } from 'react-error-boundary';
import type { FunctionComponent } from 'react';

import { Button } from '@/components/button';
import styles from './404.module.scss';
import LogoIcon from '@/assets/icons/logo.svg?react';

export const Error503: FunctionComponent = () => {
	const { t } = useTranslation();
	const { resetBoundary } = useErrorBoundary();

	return (
		<div className={styles['wrapper']}>
			<div className={styles['error']}>
				<div className={styles['error__image']}>
					<LogoIcon />
				</div>

				<h1 className={styles['error__title']}>{t('error.503.title')}</h1>
			</div>

			<div className={styles['actions']}>
				<Button
					onClick={() => {
						resetBoundary();
					}}
					className={styles['actions__button']}
				>
					{t('error.503.button.refresh')}
				</Button>
			</div>
		</div>
	);
};
