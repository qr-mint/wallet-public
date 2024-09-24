import { useTranslation } from 'react-i18next';
import { type FunctionComponent } from 'react';
import { Navbar } from '@/components/navbar';
import { RecommendedList } from '@/components/home/recommended-list';
import styles from './styles.module.scss';
import AtlantaImage from '@/assets/images/recommended/atlanta.svg';

export const Recommendations: FunctionComponent = () => {
	const { t } = useTranslation();

	return (
		<div className={styles['container']}>
			<h1 className={styles['title']}>{t('navbar.recommendations')}</h1>


			<div className={styles['list']}>
				<RecommendedList
					recommendedList={[
						{
							imageSource: AtlantaImage,
							title: 'Atlanta',
							subtitle: 'Explore Atleta Network',
							link: 'https://app-olympia.atleta.network/',
						},
					]}
				/>
			</div>

			<Navbar />
		</div>
	);
};
