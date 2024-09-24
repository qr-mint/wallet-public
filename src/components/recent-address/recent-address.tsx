import styles from './recent-address.module.scss';
import type { IRecentAddress } from '@/types/recent';

import TonImage from '@/assets/images/wallets/ton.png';
import DollarImage from '@/assets/images/wallets/dollar.png';

function renderIcon (icon: string) {
	if (!icon) throw new Error('Icon пустой!');
	if (icon === 'ton') return TonImage;
	return DollarImage;
}

export function RecentAddress ({ address, datetime, network }: IRecentAddress) {
	return (
		<div className={styles['history-card']}>
			<div className={styles['history-card__icon']}>
				<img src={renderIcon(network)} alt='' />
			</div>

			<div className={styles['history-card__info']}>
				<p className={styles['history-card__info-title']}>{address}</p>
				<p className={styles['history-card__info-amount']}>{datetime}</p>
			</div>
		</div>
	);
}
