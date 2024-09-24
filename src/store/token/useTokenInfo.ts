import { create } from 'zustand';
import { apiClient } from '@/api/utils/request';
import type { Token } from '../addresses/types';
import type { TokenInfo, TokenState, TokenStore } from './types';

const initialState: TokenState = {
	tokenInfo: {} as TokenInfo | Token,
};

export const useTokenInfo = create<TokenStore>()((set) => ({
	...initialState,

	loadTokenInfo: async (tokenID: string) => {
		const response = await apiClient.get(`/api/v1/addresses/coins/${tokenID}`);
		const { coin_id, explorer_link, image_source, ...rest } = response.data.data;

		const tokenInfo = {
			coinID: coin_id,
			imageSource: image_source,
			explorerLink: explorer_link,
			...rest,
		};

		set({ tokenInfo });
	},

	saveTokenInfo: (tokenInfo: TokenInfo) => {
		set({ tokenInfo });
	},
}));
