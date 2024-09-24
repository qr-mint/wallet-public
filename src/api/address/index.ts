import type { ResponseData } from '@/types/types';
import { apiClient } from '@/api/utils/request';
import { ICoin } from '@/types/coin';
import { Result } from '../types';
import { IToken } from '@/types/token';

export interface WalletListData {
	items: IToken[];
	fiat_amount: string;
	fiat_currency: string;
	daily_price_delta_percent: string;
	name: string;
}

export async function getAddressList (): Promise<WalletListData> {
	const res = await apiClient.get('/api/v1/addresses/info');
	return res.data.data;
}
	

export async function getInfo (id: string): Promise<WalletListData> {
	const res = await apiClient.get<ResponseData<WalletListData>>(`/api/v1/addresses/coins/${id}`);
	return res.data.data;
}

interface AddAddressData {}

export interface AddAddressParamData {
	name?: string;
	mnemonic_hash: string;
	addresses?: {
		address: string;
		network: string;
	}[];
}

export async function addAddress (data: AddAddressParamData): Promise<AddAddressData> {
	const response = await apiClient.post<ResponseData<AddAddressData>>('/api/v1/addresses/import', data);
	return response.data.data;
}
