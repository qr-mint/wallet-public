import { apiClient } from '@/api/utils/request';
import { ApiRoutes } from '@/types/api/api.routes.enum';
import type { NftListRequest, NftMessageRequest, NftMessageResponse, NFTItem, NftTrasnferRequest, NftTransferResponse } from '@/types';

export class NftApi {
	static async getMessage (params: NftMessageRequest): Promise<NftMessageResponse | null> {
		const response = await apiClient.get(ApiRoutes.NFT_MESSAGE, {
			params,
		});
		return response.data.data;
	}

	static async transfer (data: NftTrasnferRequest): Promise<NftTransferResponse | null> {
		const response = await apiClient.post(ApiRoutes.NFT_TRANSFER, data);
		return response.data.data.hash;
	}

	static async getList (params: NftListRequest): Promise<NFTItem[] | null> {
		const response = await apiClient.get(ApiRoutes.NFT_GET, { params });
		return response.data.data.items;
	}

	static async getById (id: string): Promise<NFTItem | null> {
		const response = await apiClient.get(`${ApiRoutes.NFT_GET}/${id}`);
		return response.data.data;
	}
}
