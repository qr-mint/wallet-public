import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { type FunctionComponent } from 'react';
import styles from './navbar.module.scss';
import RecommendationsIcon from '@/assets/icons/navbar/recommendations.svg?react';
import WalletIcon from '@/assets/icons/navbar/wallet.svg?react';

export const Navbar: FunctionComponent = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<nav className={styles['navbar']}>
			<button
				type='button'
				onClick={() => navigate('/')}
				className={classNames(styles['navbar__link'], { [styles['active']]: location.pathname === '/' })}
			>
				<WalletIcon className={styles['navbar__link-icon']} />
				<p className={styles['navbar__link-label']}>{t('navbar.wallet')}</p>
			</button>

			<button
				type='button'
				onClick={() => navigate('/recommendations')}
				className={classNames(styles['navbar__link'], {
					[styles['active']]: location.pathname.includes('/recommendations'),
				})}
			>
				<RecommendationsIcon className={styles['navbar__link-icon']} />
				<p className={styles['navbar__link-label']}>{t('navbar.recommendations')}</p>
			</button>
		</nav>
	);
};
