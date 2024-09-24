import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { BackButton } from '@vkruglikov/react-telegram-web-app';
import type { FunctionComponent } from 'react';

import { Button } from '@/components/button';
import styles from './404.module.scss';
import LogoIcon from '@/assets/icons/logo.svg?react';
import { useErrorBoundary } from 'react-error-boundary';

export const Error404: FunctionComponent = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { resetBoundary } = useErrorBoundary();

	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate(-1)} />
			<div className={styles['error']}>
				<div className={styles['error__image']}>
					<LogoIcon />
				</div>

				<h1 className={styles['error__title']}>{t('error.404.title')}</h1>
			</div>

			<div className={styles['actions']}>
				<Button
					onClick={() => {
						navigate('/');
						resetBoundary();
					}}
					className={styles['actions__button']}
				>
					{t('error.404.button.back')}
				</Button>
			</div>
		</div>
	);
};
