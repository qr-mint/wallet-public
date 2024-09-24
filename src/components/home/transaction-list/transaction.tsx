import cn from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FunctionComponent } from 'react';

import { Link } from 'react-router-dom';

import { formatDate } from '@/utils/date';
import { formatAddress } from '@/helpers/addressFormatter';
import type { TransactionProps } from './types';

import styles from './transaction.module.scss';
import ArrowUpIcon from '@/assets/icons/transaction/arrow-up.svg?react';
import ArrowDownIcon from '@/assets/icons/transaction/arrow-down.svg?react';

export enum TransactionType {
	in = 'in',
	out = 'out',
}

export const Transaction: FunctionComponent<TransactionProps> = ({ transaction, className, ...props }) => {
	const { t } = useTranslation();

	const [ isHidden, setIsHidden ] = useState<boolean>(true);

	const handleToggle = () => {
		setIsHidden((prev) => !prev);
	};

	const handleShare = async (address: string) => {
		try {
			await navigator.share({ text: address });
		} catch (error) {
			console.error(t('notify.error.address.share'), error);
		}
	};

	const _renderIcon = (type: string) => {
		if (type === TransactionType.out) {
			return <ArrowUpIcon />;
		}
		return <ArrowDownIcon />;
	};

	return (
		<div className={cn(styles['transaction'], className, { [styles['hidden']]: isHidden })} {...props}>
			<div onClick={handleToggle} className={styles['transaction-main']}>
				<div className={styles['transaction-main__icon']}>{_renderIcon(transaction.type)}</div>

				<p className={styles['transaction-main__title']}>{t(`transaction.${transaction.type}.title`)}</p>
				<p className={styles['transaction-main__datetime']}>{formatDate(transaction.createdAt, t)}</p>
				<p className={styles['transaction-main__amount']}>
					{transaction.type === TransactionType.out ? '-' : '+'}
					{transaction.amount} {transaction.coinName}
				</p>
				<p className={cn(styles['transaction-main__status'], styles[transaction.status])}>{transaction.status}</p>
			</div>

			<div className={styles['transaction-footer']}>
				<div className={styles['transaction-info']}>
					<p className={styles['transaction-info__title']}>{t('transaction.footer.info.hash')}</p>
					<p className={styles['transaction-info__value']}>{formatAddress(transaction.hash)}</p>
				</div>

				<div className={styles['transaction-info']}>
					<p className={styles['transaction-info__title']}>{t('transaction.footer.info.from')}</p>
					<p className={styles['transaction-info__value']}>{formatAddress(transaction.addressFrom)}</p>
				</div>

				<div className={styles['transaction-info']}>
					<p className={styles['transaction-info__title']}>{t('transaction.footer.info.to')}</p>
					<p className={styles['transaction-info__value']}>{formatAddress(transaction.addressTo)}</p>
				</div>

				<div className={styles['transaction-info']}>
					<p className={styles['transaction-info__title']}>{t('transaction.footer.info.network')}</p>
					<p className={styles['transaction-info__value']}>{formatAddress(transaction.network.toUpperCase())}</p>
				</div>

				<div className={styles['transaction-footer__actions']}>
					<Link to={transaction.explorerLink} target='_blank' className={styles['transaction-footer__link']}>
						{t('transaction.footer.explorer-link')}
					</Link>

					{!!navigator.share && (
						<button
							type='button'
							className={styles['transaction-footer__link']}
							onClick={() => handleShare(transaction.explorerLink)}
						>
							{t('transaction.footer.explorer-link.share')}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
