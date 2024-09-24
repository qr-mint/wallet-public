import { Token } from '@/store/addresses/types';

export interface TokenInfo extends Token {
	coinID: number;
	caption: string;
	address: string
	explorerLink: string;
}

export interface TokenState {
	tokenInfo: TokenInfo | Token;
}

export interface TokenActions {
	loadTokenInfo: (network: string) => Promise<void>;
	saveTokenInfo: (tokenInfo: TokenInfo | Token) => void;
}

export type TokenStore = TokenState & TokenActions;