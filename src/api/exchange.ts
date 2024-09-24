import { apiClient } from '@/api/utils/request';
import { ServerResponse } from '@/api/types';
import {
	ExchangeAddressRequest,
	ExchangeAddressResponse,
	ExchangeAmountRequest,
	ExchangeAmountResponse,
	ExchangeLimitRequest,
	ExchangeLimitResponse,
	ApiRoutes
} from '@/types';

export const ExchangeApi = {
	async getExchangeAmount (params: ExchangeAmountRequest): Promise<ExchangeAmountResponse | null> {
		const response = await apiClient.get<ServerResponse<ExchangeAmountResponse>>(
			ApiRoutes.EXCHANGE_AMOUNT,
			{ params }
		);
		return response.data.data;
	},

	async getExchangeAddress (params: ExchangeAddressRequest): Promise<ExchangeAddressResponse | null> {
		const response = await apiClient.get<ServerResponse<ExchangeAddressResponse>>(
			ApiRoutes.EXCHANGE_ADDRESS,
			{ params }
		);
		return response.data.data;
	},

	async getExchangeLimits (params: ExchangeLimitRequest): Promise<ExchangeLimitResponse | null> {
		const response = await apiClient.get<ServerResponse<ExchangeLimitResponse>>(
			ApiRoutes.EXCHANGE_LIMITS,
			{ params }
		);
		return response.data.data;
	}
} as const;

