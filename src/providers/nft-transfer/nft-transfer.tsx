/* eslint-disable react-hooks/rules-of-hooks */

import { useState } from 'react';
import { useQueryParam, StringParam } from 'use-query-params';
import type { AxiosError } from 'axios';

import networks from '@/crypto/networks';
import { NftApi } from '@/api/nft';
import { formatAddress } from '@/helpers/addressFormatter';
import { CryptoMnemonic } from '@/crypto/mnemonic';
import { useAddressStore } from '@/store/addresses';
import type { Coin } from './types';
import type { NftMessageRequest, NFTItem } from '@/types';

enum AddressFieldError {
	required = 'field.errors.address-requireds',
	incorrect = 'field.errors.address-incorrect',
}

enum Blockchain {
	trc20 = 'trc20',
	ton = 'ton',
}

export class NFTTransfer {
	private __network: string = '';
	private __addressTo: string = '';
	private __addressFrom: string = '';
	private __nft: NFTItem | null = null;

	private __coins: Coin[] = {} as Coin[];

	private __setNetwork: (value: string) => void;
	private __setAddressTo: (value: string) => void;
	private __setNft: (value: NFTItem | null) => void;

	private __loadNftById: (value: string) => Promise<NFTItem | null>;

	private __fetchCoins: (callback?: (error: AxiosError) => void) => Promise<void>;

	constructor () {
		const { coins, fetchCoins } = useAddressStore();

		const [ network, setNetwork ] = useQueryParam('network', StringParam);
		const [ addressTo, setAddressTo ] = useQueryParam('addressTo', StringParam);
		const [ nft, setNft ] = useState<NFTItem | null>(null);

		this.__network = network as string;
		this.__addressTo = addressTo as string;
		this.__nft = nft;

		this.__coins = coins;

		this.__setNetwork = setNetwork;
		this.__setAddressTo = setAddressTo;
		this.__setNft = setNft;

		this.__loadNftById = NftApi.getById;

		this.__fetchCoins = fetchCoins;
	}

	get addressTo (): string {
		return this.__addressTo;
	}

	get addressFrom (): string {
		return this.__addressFrom;
	}

	get network (): string {
		return this.__network;
	}

	get nft (): NFTItem {
		return this.__nft;
	}

	public setNetwork () {
		if (this.__nft)
			this.__setNetwork(this.__nft.network);
	}

	public setAddressTo (address: string) {
		this.__setAddressTo(address);
	}

	public setNft (value: NFTItem | null) {
		this.__setNft(value);
	}

	public getShortAddressTo (): string {
		return formatAddress(this.__addressTo);
	}

	public async fetchNftById (id: string) {
		const item = await this.__loadNftById(id);
		this.setNft(item);
		return item;
	}

	public validateAddress (address: string, t: (key: string) => string): string | undefined {
		if (!address || !this.__nft?.network) {
			return t(AddressFieldError.required);
		}

		const network = this.__nft.network as Blockchain;
		const isValid = networks[network].validateAddress(address);

		if (!isValid) {
			return t(AddressFieldError.incorrect);
		}

		return;
	}

	public async send (code: string): Promise<string | null> {
		if (!this.__nft) return '';

		const chain = this.__nft.network.split('_')[0];
		const crypto = networks[chain as 'trc20' | 'ton'];

		const seed = await new CryptoMnemonic().loadMnemonic(code);
		const keys = await crypto.getAccount(seed);

		const body: NftMessageRequest = {
			nft_id: Number(this.__nft.id),
			network: this.__nft.network,
			address_to: this.addressTo,
		};

		if (chain === Blockchain.ton) {
			body.version = 42;
			body.public_key = keys.public.toString('hex');
		}

		const signerMessages = await NftApi.getMessage(body);

		await crypto.sign(signerMessages, keys.private);
		const { ...message } = signerMessages;

		return await NftApi.transfer({ message, network: chain, nft_id: this.__nft.id });
	}
}
