interface Transaction {
	id: number,
	hash: string,
	amount: string,
	network: string,
	coin_name: string,
	status: string,
	type: string,
	address_from: string,
	address_to: string,
	created_at: string,
	explorer_link: string
}

export const transformTransactions = (transactions: Transaction[]) => {
	if (!transactions) return [];

	return transactions.map(({ coin_name, address_from, address_to, created_at, explorer_link, ...rest }) => ({
		coinName: coin_name,
		addressFrom: address_from,
		addressTo: address_to,
		createdAt: created_at,
		explorerLink: explorer_link,
		...rest,
	}));
};
