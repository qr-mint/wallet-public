export interface GetTransactionParams {
	limit: number;
	offset: number;
	addressCoinID?: string | number;
	onlyOut?: boolean;
}
