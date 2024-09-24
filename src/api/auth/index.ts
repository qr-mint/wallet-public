import { apiClient } from '../utils/request';
import type { TelegramAuthData, TelegramAuthResponse } from './types';

export async function telegramAuth (data: TelegramAuthData): Promise<TelegramAuthResponse> {
	const response = await apiClient.post('/api/v1/auth/telegram', data);
	return response.data.data;
}

export async function refreshAuthToken (): Promise<TelegramAuthResponse> {
	const response = await apiClient.post('/api/v1/auth/refresh');
	return response.data.data;
}
