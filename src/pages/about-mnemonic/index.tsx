import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

export const AboutMnemonic: FunctionComponent = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<div className={styles['container']}>
			<BackButton onClick={() => navigate('/')} />

			<h2 className={styles['title']}>{t('about-mnemonic.title.1')}</h2>

			<p className={styles['description']}>
				{t('about-mnemonic.description.1')}
			</p>

			<h2 className={styles['title']}>{t('about-mnemonic.title.2')}</h2>

			<p className={styles['description']}>
				{t('about-mnemonic.description.2')}
			</p>

			<p className={styles['quote']}>
				{t('about-mnemonic.description.3')}
			</p>
		</div>
	);
};
