import { apiClient } from '@/api/utils/request';

interface Call {
  method: string;
  params: any[];
}

interface Message {
  amount: number;
  from: string;
  to: string;
  call: Call
}

export interface TransferBody {
  from_address: string;
  network: string;
  message: Message
}

export async function buildCustomTransfer (body: TransferBody) {
	const response = await apiClient.post('/api/v1/txs/build-custom-transfer', body);
	return response.data.data;
}