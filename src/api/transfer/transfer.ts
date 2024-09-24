import { apiClient } from '@/api/utils/request';

export async function transfer (body: any): Promise<string> {
	const response = await apiClient.post('/api/v1/transfer', body);
	return response.data.data.hash;
}
