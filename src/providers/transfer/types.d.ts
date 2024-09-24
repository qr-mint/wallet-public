import type { Coin } from '@/store/addresses/types';
import { TokenInfo } from '@/store/token/types';

export interface ITransfer {
	network: string;
	address: string;
	amount: number;
	memo: string;
	tokens: Coin[];
	wallet: TokenInfo;
	coinLogo: string;
	loadWallet(network: string): Promise<void>;
	handleAddress: (address: string) => void;
	send: (value: string, network?: string) => Promise<string>;
	validateAddress: (address: string, t: any) => string | undefined;
	setMemo: (value: string) => void;
	setAmount: (value: string) => void;
	getAmountLabel: () => string;
	getShortAddress: () => string;
}

export { Coin };
