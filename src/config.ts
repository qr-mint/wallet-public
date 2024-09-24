export const coins = [
	{
		network: 'ton_ton',
		currency: 'ton',
	},
	{
		network: 'trc_usdt',
		currency: 'usdt',
	},
];

export const coinCurrencies = coins.map((coin) => coin.currency);
export const coinNetworks = coins.map((coin) => coin.network);

export const currencies = [
	{
		id: 'USD',
		label: 'USD',
	},
	{
		id: 'EUR',
		label: 'EUR',
	},
	{
		id: 'RUB',
		label: 'RUB',
	},
];

export const languages = [
	{
		id: 'en',
		label: 'English',
	},
	{
		id: 'ru',
		label: 'Русский',
	},
];
