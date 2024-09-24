import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.scss';
import BankIcon from '@/assets/icons/action-button/bank.svg?react';
import P2PIcon from '@/assets/icons/action-button/p2p.svg?react';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import React from 'react';

export function SelectDeposit () {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<div className={styles['wrapper']}>
			<BackButton
				onClick={() => {
					navigate('/');
				}}
			/>

			<h1 className={styles['title']}>{t('payment.title')}</h1>

			<div className={styles['actions']}>
				<ActionButton
					icon={<BankIcon />}
					onClick={() => navigate(`/payments/select${window.location.search}`)}
					title={t('payment.bank.title')}
					subtitle={t('payment.bank.subtitle')}
				/>

				<ActionButton
					disable={true}
					icon={<P2PIcon />}
					//to={'/p2p/select'}
					title={t('payment.p2p.title')}
					subtitle={t('payment.p2p.subtitle')}
				/>
			</div>
		</div>
	);
}

interface ActionButtonProps {
	onClick?: () => void;
	icon: React.ReactNode;
	title: string;
	subtitle: string;
	disable?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, title, subtitle, icon, disable = false }) => {
	return (
		<button
			type='button'
			onClick={onClick}
			className={cn(styles['actions__button'], styles['action-button'], { [styles.disable]: disable })}
		>
			<div className={styles['action-button__icon']}>{icon}</div>

			<p className={styles['action-button__title']}>{title}</p>
			<p className={styles['action-button__subtitle']}>{subtitle}</p>

			<div className={styles['action-button__right-icon']}>
				<ChevronRightIcon />
			</div>
		</button>
	);
};
