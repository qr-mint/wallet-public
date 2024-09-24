import { AxiosError } from 'axios';

interface Token {
	id: number;
	name: string;
	amount: string;
	symbol: string;
	network: string;
	fiatAmount: string;
	fiatCurrency: string;
	imageSource: string;
	dailyPriceDeltaPercent: string;
}

interface Coin extends Omit<Token, 'fiatAmount' | 'fiatCurrency'> {
	coinID: number;
	caption: string;
	address: string;
	isVisible: boolean;
}

export interface AddressesState {
	name: string;
	coins: Coin[];
	tokens: Token[];
	fiatAmount: number;
	fiatCurrency: string;
	dailyPriceDeltaPercent: string;
}

interface AddressesAction {
	fetchCoins: (callback?: (error: AxiosError) => void) => Promise<void>;
	switchCoin: (data: { network: string; visible: boolean; id: number }) => Promise<void>;
	updateName: (name: string) => Promise<void>;
	loadAddresses: (callback?: (e: AxiosError) => void) => Promise<void>;
}

export type AddressesStore = AddressesState & AddressesAction;
