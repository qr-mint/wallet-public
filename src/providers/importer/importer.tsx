/* eslint-disable react-hooks/rules-of-hooks */

import { createContext, useState } from 'react';

import networks from '@/crypto/networks';
import { shuffle } from '@/utils/random';
import { CryptoMnemonic } from '@/crypto/mnemonic';
import { verifyMnemonic } from '@/api/mnemonic/mnemonic';
import { useAccountStore } from '@/store/useAccountStore';
import { addAddress } from '@/api/address';
import type { AddWallet, Address, IImporter } from './types';

export const ImporterContext = createContext<IImporter>({} as IImporter);

const errors = {
	not_empty: 'field.errors.not-empty',
	not_found_word: 'field.errors.not-found-word',
	words_has_to_be_12_words: 'field.errors.words-has-to-be-12-words',
};

export class Importer implements IImporter {
	private __name: string;
	private __words: string;
	private __networks: string[];
	private __isValid: boolean;

	private mnemonic: CryptoMnemonic;

	constructor () {
		const [ words, setWords ] = useState<string>('');
		const [ name, setName ] = useState<string>('');
		const [ isValid, setIsValid ] = useState<boolean>(false);
		const [ chains, setChains ] = useState<string[]>(Object.keys(networks).map((net) => net));
		this.mnemonic = new CryptoMnemonic();

		const { connect } = useAccountStore();

		this.__connect = connect;

		this.__words = words;
		this.__setWords = setWords;

		this.__name = name;
		this.__setName = setName;

		this.__networks = chains;
		this.__setNetworks = setChains;
		this.__isValid = isValid;
		this.__setIsValid = setIsValid;
	}

	private __setWords: (words: string) => void;
	private __setName: (name: string) => void;
	private __setNetworks: (network: string[]) => void;
	private __setIsValid: (isValid: boolean) => void;
	private __connect: () => void;

	public get name (): string {
		return this.__name;
	}

	public get isValid (): boolean {
		return this.__isValid;
	}

	public get words (): string {
		return this.__words;
	}

	public setName (name: string) {
		this.__setName(name);
	}

	public setWords (words: string) {
		this.__setWords(words);
	}

	public setIsValid (isValid: boolean) {
		this.__setIsValid(isValid);
	}

	public setNetworks (net: string) {
		if (this.__networks.includes(net)) {
			this.__setNetworks(this.__networks.filter((chain) => chain !== net));
		} else {
			this.__setNetworks(this.__networks.concat(net));
		}
	}

	generateMnemonic () {
		return this.mnemonic.generate();
	}

	async connect (code: string): Promise<void> {
		const mnemonic_hash = this.mnemonic.toHash(this.words);
		const wallet_data = { mnemonic_hash } as AddWallet;

		if (this.name) {
			const addresses = (await this.parseAddresses()) as Address[];
			wallet_data.addresses = addresses;
			wallet_data.name = this.name;
		}
		await this.mnemonic.save(this.words, code);
		this.mnemonic.saveHash(mnemonic_hash);
		await addAddress(wallet_data);
		this.__connect();
	}

	parseAddresses = () => {
		return Promise.all(
			this.__networks.map(async (network: string) => {
				try {
					const crypto = networks[network as 'trc20' | 'ton'];
					const keys = await crypto.getAccount(this.words);
					const address = await crypto.getAddress(keys.public);

					return {
						network: crypto.chain,
						address,
					};
				} catch (err: any) {
					throw new Error(`${network}: ${err.message}`);
				}
			}),
		);
	};

	validateWords (value: string) {
		if (!value) {
			return errors.not_empty;
		}
		const words = value.includes(',') ? value.trim().split(',') : value.split(' ');
		if (!this.mnemonic.validateWords(words)) {
			return errors.not_found_word;
		}
		if (words.length < 12) {
			return errors.words_has_to_be_12_words;
		}
	}

	shuffleMnemonic (): string[] {
		return shuffle(this.words.split(' '));
	}

	async verifyMnemonic (words: string) {
		const hash = this.mnemonic.toHash(words);
		return await verifyMnemonic(hash);
	}
}
