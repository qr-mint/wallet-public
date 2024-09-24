/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useQueryParam, StringParam, NumberParam } from 'use-query-params';

import networks from '@/crypto/networks';
import { transfer } from '@/api/transfer/transfer';
import { useTokenInfo } from '@/store/token/useTokenInfo';
import { formatAddress } from '@/helpers/addressFormatter';
import { CryptoMnemonic } from '@/crypto/mnemonic';
import { useAddressStore } from '@/store/addresses';
import { buildTransfer, TransferBody } from '@/api/transfer/build_transfer';
import type { Coin, ITransfer } from './types';
import { TokenInfo } from '@/store/token/types';

const API_URL = process.env.API_URL;

enum validatorError {
	addressRequired = 'field.errors.address-requireds',
	address = 'field.errors.address-incorrect',
}

enum Network {
	trc20 = 'trc20',
	ton = 'ton',
}
export class Transfer implements ITransfer {
	private __to_address: string = '';
	private __coinLogo: string = '';
	private __amount: number = 0;
	private __memo: string = '';

	private __coins: Coin[];
	private __wallet: TokenInfo;

	constructor () {
		const { showBoundary } = useErrorBoundary();
		const { coins, fetchCoins } = useAddressStore();
		const { loadTokenInfo, tokenInfo } = useTokenInfo();

		const [ address, setAddress ] = useQueryParam('address', StringParam);
		const [ amount, setAmount ] = useQueryParam('amount', NumberParam);
		const [ memo, setMemo ] = useQueryParam('memo', StringParam);

		useEffect(() => {
			fetchCoins(showBoundary);

			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		this.__to_address = address as string;
		this.__amount = amount as number;
		this.__memo = memo as string;

		this.__coins = coins;
		this.__wallet = tokenInfo;

		this.__setAddress = setAddress;
		this.__setAmount = setAmount;
		this.__setMemo = setMemo;

		this.__loadTokenInfo = loadTokenInfo;
	}

	private __loadTokenInfo: (network: string) => Promise<void>;

	get network (): string {
		return `${this.wallet.network}_${this.wallet.name}`;
	}

	get address (): string {
		return this.__to_address;
	}

	get amount (): number {
		return this.__amount;
	}

	get memo (): string {
		return this.__memo;
	}

	get tokens () {
		return this.__coins;
	}

	get wallet () {
		return this.__wallet;
	}

	get coinLogo (): string {
		return `${API_URL}/${this.__wallet.imageSource}`;
	}

	private __setAddress: (val: any) => void;
	private __setAmount: (val: any) => void;
	private __setMemo: (val: any) => void;

	public handleAddress (address: string) {
		this.__setAddress(address);
	}

	public setMemo (val: string) {
		this.__setMemo(val);
	}

	public setAmount (val: string) {
		this.__setAmount(parseFloat(val));
	}

	public getAmountLabel () {
		const symbol = this.__wallet.name;
		return `${this.__amount} ${symbol}`;
	}

	public getShortAddress (): string {
		return `${formatAddress(this.__to_address)}`;
	}

	public validateAddress (address: string, t: any): string | undefined {
		if (!address) return t(validatorError.addressRequired);

		const validatedAddress = networks[this.__wallet.network as 'trc20' | 'ton'].validateAddress(address);
		if (!validatedAddress) {
			return t(validatorError.address);
		}
		return;
	}

	public async loadWallet (network: string) {
		await this.__loadTokenInfo(network);
	}

	public async send (code: string): Promise<string> {
		const chain = this.network.split('_')[0];
		const crypto = networks[chain as 'trc20' | 'ton'];
		const seed = await new CryptoMnemonic().loadMnemonic(code);
		const keys = await crypto.getAccount(seed);
		const [ net, coin_name ] = this.network.split('_');
		const body: TransferBody = {
			amount: this.__amount,
			address_to: this.__to_address,
			network: net,
			coin_name,
		};

		if (this.__memo) {
			body.comment = this.__memo;
		}

		if (chain === Network.ton) {
			body.version = 42;
			body.public_key = keys.public.toString('hex');
		}

		const signerMessages = await buildTransfer(body);

		await crypto.sign(signerMessages, keys.private);
		const { ...message } = signerMessages;

		return await transfer({ message, network: net, coin_name, amount: this.__amount });
	}
}
