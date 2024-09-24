export type ITransaction = {
	id: number,
	hash: string,
	amount: string,
	network: string,
	coinName: string,
	status: string,
	type: string,
	addressFrom: string,
	addressTo: string,
	createdAt: string,
	explorerLink: string
}