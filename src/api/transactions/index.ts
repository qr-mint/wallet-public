import { apiClient } from '@/api/utils/request';
import type { GetTransactionParams } from './types';
import { ITransaction } from '@/types/transaction';

export async function getTransactions (params: GetTransactionParams): Promise<ITransaction[]> {
	const response = await apiClient.get('/api/v1/transactions', { params });
	return response.data.data.items;
}
