

export interface IWallet extends ICommonWallet {
	address: string;
	balance: string;
	amount: string;
	fiat_amount: string;
	fiat_currency: string;
	image_source: string;
	name: string;
	network: string;
	symbol: string;
}

export interface ICommonWallet {
	fiat: number;
	fiat_currency: string;
	name: string;
}
