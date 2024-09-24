import { useTranslation } from 'react-i18next';
import { useState, type FunctionComponent } from 'react';

import { Field } from '@/components/field';
import SearchIcon from '@/assets/icons/fields/search.svg?react';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react';
import styles from './page.module.scss';

import DropHunterImage from '@/assets/images/dapps/drophunter.jpg';
import NexusCatalogImage from '@/assets/images/dapps/nexus-catalog.jpg';
import MuslimbitImage from '@/assets/images/dapps/muslimbit.webp';
import MuslimbitZikrImage from '@/assets/images/dapps/muslimbit-zikr.jpg'; 
import Logo from '@/assets/icons/logo.svg?react';

const applications = [
	{
		title: 'DropHunter',
		description: 'Catch coins and exchange them for AirDrops from cool crypto projects!',
		src: DropHunterImage,
		href: 'https://t.me/drophuntergames_bot'		
	},
	{
		title: 'Muslimbit Zikr',
		description: 'Muslimbit Zikr - This app allows you to accumulate Khoja points for your activity.  They can be spent on charity or participated in the token drop of the Muslimbit exchange.',
		src: MuslimbitZikrImage,
		href: 'https://t.me/muslimbit_zikr_bot'
	},
	{
		title: 'Muslimbit',
		description: 'Muslimbit is an innovative cryptocurrency exchange based on the principles of Islamic finance.',
		src: MuslimbitImage,
		href: 'https://muslimbit.com/'
	},
	{
		title: 'Nexus Catalog',
		src: NexusCatalogImage,
		href: 'https://t.me/nexus_catalog_bot',
		description: ''
	}
];

export const D_Apps: FunctionComponent = () => {
	const { t } = useTranslation();
	const [ search, setSearch ] = useState<string>('');	

	return (
		<div className={styles['wrapper']}>
			<div className={styles['banner']}>
				<p className={styles['banner__title']}>Nexus Wallet</p>
				<p className={styles['banner__subtitle']}>{t('dapps.banner.title')}</p>

				<p className={styles['banner__version']}>web3.0</p>

				<div className={styles['banner__image']}>
					<Logo />
				</div>
			</div>

			<Field
				onChange={(e) => setSearch(e.target.value)}
				icon={<SearchIcon />}
				placeholder={t('field.search.dapps.title')}
			/>

			<div className={styles['cards']}>
				<ul className={styles['cards__list']}>
					{applications
						.filter((app) => app.title.includes(search))
						.map((application) => (
							<li className={styles['cards__item']}>
								<GameCard
									title={application.title}
									description={application.description}
									image={{ src: application.src, alt: 'drophunter' }}
									href={application.href}
								/>
							</li>
						))}
				</ul>
			</div>

			<footer className={styles['footer']}>
				<div className={styles['footer__links']}>
					<a href="https://t.me/nexuswallet" target='_blank' className={styles['footer__link']}>
						<div className={styles['footer__link-icon']}>
							<svg xmlns='http://www.w3.org/2000/svg' width='22' height='20' viewBox='0 0 22 20' fill='none'>
								<path
									d='M13.5629 9.45105L9.71266 12.1885C8.64682 12.9463 8.58308 14.5063 9.58356 15.3485L13.3734 18.5389C14.4397 19.4365 16.0742 18.9955 16.5443 17.6833L21.0888 4.99635C21.3643 4.22718 20.6511 3.47012 19.8669 3.69926L2.58925 8.74754C1.77019 8.98686 1.60788 10.0761 2.32157 10.5438L3.26047 11.1591C4.36311 11.8817 5.75101 12.0147 6.97075 11.5144L13.2752 8.92898C13.6052 8.79366 13.8536 9.24438 13.5629 9.45105Z'
									fill='#1381E7'
								/>
							</svg>
						</div>

						<span className={styles['footer__link-title']}>Join Channel (RU)</span>
					</a>
					<a href="https://t.me/nexuswallet_eng" target='_blank' className={styles['footer__link']}>
						<div className={styles['footer__link-icon']}>
							<svg xmlns='http://www.w3.org/2000/svg' width='22' height='20' viewBox='0 0 22 20' fill='none'>
								<path
									d='M13.5629 9.45105L9.71266 12.1885C8.64682 12.9463 8.58308 14.5063 9.58356 15.3485L13.3734 18.5389C14.4397 19.4365 16.0742 18.9955 16.5443 17.6833L21.0888 4.99635C21.3643 4.22718 20.6511 3.47012 19.8669 3.69926L2.58925 8.74754C1.77019 8.98686 1.60788 10.0761 2.32157 10.5438L3.26047 11.1591C4.36311 11.8817 5.75101 12.0147 6.97075 11.5144L13.2752 8.92898C13.6052 8.79366 13.8536 9.24438 13.5629 9.45105Z'
									fill='#1381E7'
								/>
							</svg>
						</div>
						<span className={styles['footer__link-title']}>Join Channel (EN)</span>
					</a>
				</div>

				<p className={styles['footer__cp']}>
					@ 2024 dApps Center <br /> ...
				</p>
			</footer>
		</div>
	);
};

interface GameCardProps {
	title: string;
	description: string;
	image: { src: string; alt: string };
	onClick?: () => void;
	href?: string;
}

function GameCard ({ title, description, image, onClick, href }: GameCardProps) {
	return (
		<a href={href} target='_blank' className={styles['game-card']} onClick={onClick}>
			<div className={styles['game-card__image']}>
				<img {...image} />
			</div>

			<div className={styles['game-card__info']}>
				<p className={styles['game-card__title']}>{title}</p>
				<p className={styles['game-card__description']}>{description}</p>
			</div>

			<button className={styles['game-card__button']}>
				<ChevronRightIcon />
			</button>
		</a>
	);
}
