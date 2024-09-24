import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './page.module.scss';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { methods } from '../const';

export function Select () {
	const [searchParams] = useSearchParams();
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate('/select-deposit')} />

			<h1 className={styles['title']}>
				{t('payments.select.title')}
			</h1>

			<div className={styles['actions']}>
				{methods.map((method) => (
					<button
						key={method.key}
						type='button'
						onClick={() => {
							const network = searchParams.get('selected-coin');
							if ([ 'lets_exachange', 'uniramp' ].includes(method.key)) {
								navigate(`/payments/${method.key}`);
							} else if (network) {
								navigate(`/payments/amount/${method.key}/${network}`);
							} else {
								navigate(`/payments/select/${method.key}/network`);
							}
						}}
						className={[ styles['actions__button'], styles['action-button'] ].join(' ')}
					>
						<div className={`${styles['action-button__icon']}`}>
							{method.icon ? method.icon : <img width={24} height={24} src={method.image} />}
						</div>

						<p className={styles['action-button__title']}>{method.name}</p>
						<p className={styles['action-button__subtitle']}>{t('payments.select.method.subtitle', { name: method.name })}</p>

						<div className={styles['action-button__right-icon']}>
							<ChevronRightIcon />
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
