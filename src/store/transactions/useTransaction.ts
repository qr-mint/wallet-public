import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiClient } from '@/api/utils/request';
import { transformTransactions } from './utils';
import type { TransactionState, TransactionStore } from './types';

const limit = 30;

const initialState: TransactionState = {
	page: 1,
	noMore: false,
	loading: true,
	fetching: false,
	transactions: [],
};

export const useTransactionsStore = create<TransactionStore>()(
	devtools((set, get) => ({
		...initialState,

		fetchTransactions: async (options, callback) => {
			try {
				set({ transactions: [], loading: true, noMore: false });

				const response = await apiClient.get('/api/v1/transactions', { params: { limit, offset: 0, ...options } });
				const transactions = transformTransactions(response.data.data.items);

				set({ page: 1, transactions });
			} catch (e) {
				callback?.(e);
				console.error(e);
			} finally {
				set({ loading: false });
			}
		},

		fetchNextTransactions: async (options, callback) => {
			try {
				const { transactions, page, noMore } = get();
				if (noMore) return;

				const offset = page * limit;

				set({ fetching: true });

				const response = await apiClient.get('/api/v1/transactions', { params: { limit, offset, ...options } });
				const nextTransactions = transformTransactions(response.data.data.items);

				set({
					page: nextTransactions.length === 0 ? page : page + 1,
					noMore: nextTransactions.length === 0,
					transactions: [ ...transactions, ...nextTransactions ],
				});
			} catch (error) {
				console.error(error);
				callback?.(error);
			} finally {
				set({ fetching: false });
			}
		},
	})),
);
