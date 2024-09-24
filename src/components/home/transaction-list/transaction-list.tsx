import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, type FunctionComponent } from 'react';

import { Transaction } from './transaction';
import { Loading, colors } from '@/components/loading';
import { TransactionSkeleton } from './transaction-skeleton';
import styles from './transaction.module.scss';
import type { TransactionListProps } from './types';
import { ITransaction } from '@/types/transaction';

export const TransactionList: FunctionComponent<TransactionListProps> = ({
	noMore,
	loading,
	fetching,
	className,
	transactionList,
}) => {
	const { t } = useTranslation();
	const [ delay, setDelay ] = useState<boolean>(true);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setDelay(false);
		}, 300);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	const _renderTransactions = (transactions: ITransaction[]) => {
		if (loading || delay) {
			return <TransactionSkeleton count={6} />;
		} else if (transactions.length === 0) {
			return <p className={styles['transaction-list__title']}>{t('transactions.error.not-found')}</p>;
		}
		return transactions.map((transaction, key) => <Transaction transaction={transaction} key={key} />);
	};

	return (
		<div className={cn(styles['transaction-list'], className)}>
			{_renderTransactions(transactionList)}

			{transactionList.length !== 0 && fetching && !noMore && (
				<Loading color={colors.blue} className={styles['transaction-list__loading']} />
			)}

			{transactionList.length !== 0 && noMore && <p className={styles['transaction-list__title']}>{t('transactions.error.no-more')}</p>}
		</div>
	);
};
