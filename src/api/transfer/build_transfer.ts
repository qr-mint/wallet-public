import qs from 'qs';
import { apiClient } from '@/api/utils/request';

export interface TransferBody {
  address_to: string;
  amount: number;
  network: string;
  coin_name: string;
  public_key?: string;
  version?: number;
  comment?: string;
}

export async function buildTransfer (body: TransferBody) {
	const response = await apiClient.get(`/api/v1/transfer/message?${qs.stringify(body)}`);
	return response.data.data;
}