import type { IMnemonic } from '@/api/mnemonic/mnemonic';

export interface Address {
	address: string;
	network: string;
}

export interface AddWallet {
	name?: string;
	mnemonic_hash: string;
	addresses?: Address[];
}

export interface IImporter {
	name: string;
	words: string;
	isValid: boolean;
	setWords: (words: string) => void;
	setName: (name: string) => void;
	setNetworks: (network: string) => void;
	generateMnemonic: () => Promise<IMnemonic>;
	connect: (code: string) => Promise<void>;
	validateWords: (value: string) => string | undefined;
	verifyMnemonic: (words: string) => Promise<boolean>;
	shuffleMnemonic: () => string[];
}
