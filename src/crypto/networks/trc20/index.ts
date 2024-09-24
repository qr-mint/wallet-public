import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { sha256 } from 'ethereum-cryptography/sha256.js';
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { HDKey } from 'ethereum-cryptography/hdkey.js';
import { mnemonicToSeedSync } from 'ethereum-cryptography/bip39/index.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { binary_to_base58, base58_to_binary } from 'base58-js';
import { Keys } from '../networks';
import { Signer } from '../../signer';

export const ADDRESS_SIZE = 34;
export const ADDRESS_PREFIX = '41';
export const ADDRESS_PREFIX_BYTE = 0x41;
export const ADDRESS_PREFIX_REGEX = /^(41)/;

export class TronCrypto extends Signer {
	constructor (chain: string) {
		super(chain);
	}
  
	async getAccount (mnemonic: string, password = '', index = 0): Promise<Keys> {
		const seed = mnemonicToSeedSync(mnemonic);
		const node = HDKey.fromMasterSeed(seed);
		const path = `m/44'/195'/${index}'/0/0`;
		const child = node.derive(path);
		return {
			path,
			private: Buffer.from(child.privateKey as Uint8Array),
			public: this.getPublicKeyXY(child.privateKey),
		};
	}

	getPublicKeyXY (privateKeyBytes: any) {
		const pubkey = secp256k1.ProjectivePoint.fromPrivateKey(privateKeyBytes);
		const x = pubkey.x;
		const y = pubkey.y;

		const xHex = x.toString(16).padStart(64, '0');
		const yHex = y.toString(16).padStart(64, '0');

		const pubkeyHex = `04${xHex}${yHex}`;
		const pubkeyBytes = Buffer.from(pubkeyHex, 'hex');

		return pubkeyBytes;
	}

	async sign (transaction: any, privateKey: any) {
		if (typeof privateKey === 'string') {
			privateKey = Buffer.from(privateKey, 'hex');
		}

		const txHash = Buffer.from(transaction.hash, 'hex');
		const signature = this.signSecp256k1(txHash.toString('hex'), privateKey);
		//signature = Buffer.from(signature, 'hex').toString('base64');
		transaction.signature = signature;

		return transaction;
	}

	getAddress (publicKey: any): Promise<any> {
		if (publicKey.length === 65) publicKey = publicKey.slice(1);

		const hash = Buffer.from(keccak256(publicKey)).toString('hex');
		const addressHex = ADDRESS_PREFIX + hash.substring(24);

		const addressBuffer = Buffer.from(addressHex, 'hex');

		return this.getBase58CheckAddress(addressBuffer);
	}

	getBase58CheckAddress (addressBuffer: any) {
		const hash0 = sha256(addressBuffer);
		const hash1 = sha256(hash0);
		const checkSum = hash1.slice(0, 4);
		const value = Buffer.concat([ addressBuffer, checkSum ]);

		return binary_to_base58(value);
	}

	validateAddress (addressBase58: string): boolean {
		if (typeof (addressBase58) !== 'string')
			return false;

		if (addressBase58.length !== ADDRESS_SIZE)
			return false;

		let address = base58_to_binary(addressBase58);

		if (address.length !== 25)
			return false;

		if (address[0] !== ADDRESS_PREFIX_BYTE)
			return false;

		const checkSum = address.slice(21);
		address = address.slice(0, 21);

		const hash0 = sha256(address);
		const hash1 = sha256(hash0);
		const checkSum1 = hash1.slice(0, 4);

		if (checkSum[0] == checkSum1[0] && checkSum[1] == checkSum1[1] && checkSum[2] == checkSum1[2] && checkSum[3] == checkSum1[3]
		) {
			return true;
		}

		return false;
	}
}
