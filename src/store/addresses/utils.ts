interface Token {
	id: number;
	name: string;
	amount: string;
	symbol: string;
	network: string;
	fiat_amount: string;
	fiat_currency: string;
	image_source: string;
	daily_price_delta_percent: string;
}

export const transformTokens = (tokens: Token[]) => {
	if (!tokens) return [];

	return tokens.map(({ fiat_amount, fiat_currency, image_source, daily_price_delta_percent, ...rest }) => ({
		fiatAmount: fiat_amount,
		fiatCurrency: fiat_currency,
		imageSource: image_source,
		dailyPriceDeltaPercent: daily_price_delta_percent,
		...rest,
	}));
};

interface Coin extends Omit<Token, 'fiatAmount' | 'fiatCurrency'> {
	coin_id: number;
	caption: string;
	address: string;
	is_visible: boolean;
}

export const transformCoins = (coins: Coin[]) => {
	if (!coins) return [];

	return coins.map(({ coin_id, image_source, is_visible, ...rest }) => ({
		coinID: coin_id,
		imageSource: image_source,
		isVisible: is_visible,
		...rest,
	}));
};
