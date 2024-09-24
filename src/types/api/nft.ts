export type NftMessageRequest = {
	nft_id: number;
	network: string;
	address_to: string;
	version?: number;
	public_key?: string;
};

export type NftTrasnferRequest = {
	network: string;
	message: {
		body: string;
		destination_address: string;
		signature: string;
		state_init: null;
	};
	nft_id: number;
};

export interface NftMessageResponse {
	body: string;
	signature: string;
	state_init: null;
  destination_address: string;
}

export type NftListRequest = {
	limit: number;
	offset: number;
};

export type NftTransferResponse = string;

export interface NFTItem {
	id: number;
	price: number;
	index: number;
	name: string;
	network: string;
	address: string;
	token_symbol: string;
	collection_name: string;
	collection_address: string;
	collection_description: string;
	preview_urls: {
		url: string;
		resolution: string;
	}[];
}
