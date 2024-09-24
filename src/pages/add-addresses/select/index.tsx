import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Button } from '@/components/button';
import LogoIcon from '@/assets/icons/logo.svg?react';
import styles from './styles.module.scss';
import { useSettingsStore } from '@/store/useSettingsStore';

export const Select = () => {
	const navigate = useNavigate();
	const { setAlert } = useSettingsStore();
	const { t } = useTranslation();
	return (
		<div className={styles['start']}>
			<Swiper pagination={true} modules={[Pagination]} className={styles['start-swiper']}>
				<SwiperSlide>
					<div className={styles['start-swiper-slide']}>
						<div className={styles['start-swiper-slide__logo']}>
							<LogoIcon />
						</div>

						<h1
							className={styles['start-swiper-slide__title']}
							dangerouslySetInnerHTML={{ __html: t('auth.select.slice_1.title') }}
						/>

						<p
							className={styles['start-swiper-slide__description']}
							dangerouslySetInnerHTML={{ __html: t('auth.select.slice_1.subtitle') }}
						/>
					</div>
				</SwiperSlide>

				<SwiperSlide>
					<div className={styles['start-swiper-slide']}>
						<div className={styles['start-swiper-slide__logo']}>
							<LogoIcon />
						</div>

						<h1
							className={styles['start-swiper-slide__title']}
							dangerouslySetInnerHTML={{ __html: t('auth.select.slice_2.title') }}
						/>
						<p className={styles['start-swiper-slide__description']}>{t('auth.select.slice_2.subtitle')}</p>
					</div>
				</SwiperSlide>
			</Swiper>

			<div className={styles['start-actions']}>
				<Button
					onClick={() => {
						setAlert(true);
						navigate('/add-addresses/name');
					}}
					className={styles['start-actions__button']}
				>
					{t('auth.select.create.title')}
				</Button>

				<Button
					onClick={() => {
						setAlert(false);
						navigate('/add-addresses/import');
					}}
					className={styles['start-actions__button']}
					theme='secondary'
				>
					{t('auth.select.import.title')}
				</Button>
				<Button className={styles['start-actions__button']} disabled>
					{t('auth.select.ledger.title')}
				</Button>
			</div>
		</div>
	);
};
