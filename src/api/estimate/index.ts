import qs from 'qs';
import { apiClient } from '@/api/utils/request';

export interface EstimateQuery {
	network: string;
	coin_name: string;
	crypto_amount?: string;
	fiat_amount?: string;
}

export interface EstimateResponse {
	payable_amount: number;
	price: string;
}

export async function fiatToCrypto (query: EstimateQuery): Promise<EstimateResponse> {
	const res = await apiClient.get(`/api/v1/estimate/fiat-in-crypto?${qs.stringify(query)}`, { headers: { 'Currency-Code': 'usd' } });
	return res.data.data;
	
}

export async function cryptoToFiat (query: EstimateQuery): Promise<EstimateResponse> {
	const res = await apiClient.get(`/api/v1/estimate/crypto-in-fiat?${qs.stringify(query)}`, { headers: { 'Currency-Code': 'usd' } });
	return res.data.data;
	
}
