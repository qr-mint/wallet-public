import type { ITransaction } from '@/types/transaction';

interface Options {
	limit: number;
	offset: number;
	only_out: boolean;
	address_coin_id: number;
}

export interface TransactionState {
	page: number;
	noMore: boolean
	loading: boolean;
	fetching: boolean;
	transactions: ITransaction[];
}

export interface TransactionActions {
	fetchTransactions: (options?: Partial<Options>, callback?: (error: unknown) => void) => Promise<void>;
	fetchNextTransactions: (options?: Partial<Options>, callback?: (error: unknown) => void) => Promise<void>;
}

export type TransactionStore = TransactionState & TransactionActions;
