import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { VERSION } from './types.ts';
import { Coin } from '@/store/addresses/types';

interface SwapStore {
	fromCoin: Coin | null
	toCoin: Coin | null
	fromValue: number
	toValue: string

	setFromCoin: (coin: Coin | null) => void
	setToCoin: (coin: Coin | null) => void
	setFromValue: (fromValue: number) => void
	setToValue: (toValue: string) => void
	resetStore: () => void
}

export const useSwapStore = create<SwapStore>()(persist((set) => ({
	fromCoin: null,
	toCoin: null,
	fromValue: 0,
	toValue: '',

	setFromCoin: (fromCoin: Coin | null) => set(state => ({ ...state, fromCoin })),

	setToCoin: (toCoin: Coin | null) => set(state => ({ ...state, toCoin })),

	setFromValue: (fromValue: number) => set(state => ({ ...state, fromValue })),

	setToValue: (toValue: string) => set(state => ({ ...state, toValue })),

	resetStore: () => set(() => ({
		fromCoin: null,
		toCoin: null,
		fromValue: 0,
		fromConvertedValue: '',
		toValue: '',
	})),
}), { name: 'swapStore', version: VERSION }));
