import { apiClient } from '@/api/utils/request';

interface WalletSwitchData {
	network: string;
	visible: boolean;
	id: number
}

export async function switchCoin (data: WalletSwitchData) {
	const response = await apiClient.post(`api/v1/addresses/coins/${data.id}/switch`, {
		network: data.network,
		visible: data.visible
	});
	return response.data.data;
}
