import { useTranslation } from 'react-i18next';
import type { FunctionComponent } from 'react';

import { formatDate } from '@/utils/date';
import styles from './recent-address.module.scss';
import TONImage from '@/assets/images/tokens/toncoin.png';
import TRONImage from '@/assets/images/tokens/tron.png';
import TetherImage from '@/assets/images/tokens/tether.png';
import type { RecentAddressProps } from './types';

function maskString (input: string) {
	const start = input.slice(0, 5);
	const end = input.slice(-5);
	const middle = '.'.repeat(3);

	return `${start}${middle}${end}`;
}

function getCurrentImage (coinName: string) {
	if (coinName.toLowerCase().trim() === 'ton') return TONImage;
	if (coinName.toLowerCase().trim() === 'tron') return TRONImage;
	return TetherImage;
}

export const RecentAddress: FunctionComponent<RecentAddressProps> = ({ recentAddress, onClick }) => {
	const { t } = useTranslation();

	return (
		<div onClick={onClick} className={styles['recent-address']}>
			<img src={getCurrentImage(recentAddress.coinName)} className={styles['recent-address__image']} />
			<p className={styles['recent-address__hash']}>{maskString(recentAddress.addressTo || '')}</p>
			<p className={styles['recent-address__name']}>
				<span>{recentAddress.coinName}</span> • {formatDate(recentAddress.createdAt, t)}
			</p>
		</div>
	);
};
