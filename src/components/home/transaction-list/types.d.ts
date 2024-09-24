import type { HTMLAttributes } from 'react';
import type { ITransaction } from '@/types/transaction';

export interface TransactionListProps {
	transactionList: ITransaction[];
	className?: string;
	fetching?: boolean;
	loading?: boolean;
	noMore?: boolean;
}

export interface TransactionProps extends HTMLAttributes<HTMLDivElement> {
	transaction: ITransaction;
}
