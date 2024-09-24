import { apiClient } from '@/api/utils/request';
import type { ICoin } from '@/types/coin';


export async function getAddressCoins (): Promise<ICoin[]> {
	const response = await apiClient.get('/api/v1/addresses/coins');
	return response.data.data.items;
}

