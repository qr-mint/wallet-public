import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type{ AxiosError } from 'axios';

import { VERSION } from '@/store/types.ts';
import { apiClient } from '@/api/utils/request';
import { switchCoin } from '@/api/address/switch';
import { transformCoins, transformTokens } from './utils';
import type { AddressesState, AddressesStore, Coin, Token } from './types';

const initialState: AddressesState = {
	name: '',
	fiatAmount: 0,
	fiatCurrency: '',
	dailyPriceDeltaPercent: '',
	coins: [] as Coin[],
	tokens: [] as Token[],
};

export const useAddressStore = create<AddressesStore>()(
	devtools(
		persist(
			(set, get) => ({
				...initialState,

				loadAddresses: async (callback) => {
					try {
						const response = await apiClient.get('/api/v1/addresses/info');
						const data = response.data.data;
						const tokens = transformTokens(response.data.data.items);

						set({
							name: data.name,
							tokens: tokens,
							fiatAmount: parseFloat(data.fiat_amount),
							fiatCurrency: data.fiat_currency,
							dailyPriceDeltaPercent: data.daily_price_delta_percent,
						});
					} catch (e) {
						console.error(e);
						callback?.(e as AxiosError);
					}
				},

				fetchCoins: async () => {
					const response = await apiClient.get('/api/v1/addresses/coins');
					const coins = transformCoins(response.data.data.items);

					set({ coins });
				},

				switchCoin: async (data): Promise<void> => {
					const { coins, loadAddresses } = get();

					try {
						await switchCoin(data);

						const newCoins = coins.map((coin) => {
							if (coin.id === data.id) {
								return { ...coin, is_visible: data.visible };
							}
							return { ...coin, is_visible: coin.isVisible };
						});

						await loadAddresses();

						set((state) => ({ ...state, coins: newCoins }));

						// eslint-disable-next-line no-empty
					} catch {}
				},

				updateName: async (name: string) => {
					await apiClient.put('/api/v1/mnemonic/name', { value: name });
					set({ name });
				},
			}),
			{ name: 'address', version: VERSION },
		),
	),
);
