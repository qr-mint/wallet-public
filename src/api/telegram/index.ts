import { apiClient } from '@/api/utils/request';
import type { IUser } from '@/store/auth/types';

export async function getTelegramProfile (): Promise<IUser> {
	const response = await apiClient.get('/api/v1/profile');
	return response.data.data;
}
