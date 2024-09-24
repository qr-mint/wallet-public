import { apiClient } from '@/api/utils/request';
import type { IMnemonic } from './types';


export async function generateMnemonics (): Promise<IMnemonic> {
	const response = await apiClient.post('/api/v1/mnemonic/generate');
	return response.data.data.value;
}

export async function verifyMnemonic (value: string): Promise<boolean> {
	const response = await apiClient.post('/api/v1/mnemonic/validate', { value });
	return response.data.data.is_valid;
}

export async function getMnemonicName (): Promise<any> {
	const response = await apiClient.get('/api/v1/mnemonic/name');
	return response.data.data;
}

export async function updateName (name: string): Promise<void> {
	await apiClient.put('/api/v1/mnemonic/name', { value: name });
}

export async function getMnemonicNames (): Promise<any> {
	const response = await apiClient.post('/api/v1/mnemonic/names');
	return response.data.data;
}
