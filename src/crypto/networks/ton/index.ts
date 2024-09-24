import nacl from 'tweetnacl';
import { hmac } from '@noble/hashes/hmac';
import { pbkdf2 } from '@noble/hashes/pbkdf2';
import { sha512 } from '@noble/hashes/sha512';
import { contractAddress, beginCell, Cell, Address } from 'ton-core';

import { Signer } from '@/crypto/signer';
import { Keys } from '@/crypto/networks/networks.d';

export const MASTER_SECRET = Buffer.from('TON default seed', 'utf-8');
export const PBKDF_ITERATIONS = 100000;
export const DefaultSubwallet = 698983191;
export const _V4R2CodeHex = 'B5EE9C72410214010002D4000114FF00F4A413F4BCF2C80B010201200203020148040504F8F28308D71820D31FD31FD31F02F823BBF264ED44D0D31FD31FD3FFF404D15143BAF2A15151BAF2A205F901541064F910F2A3F80024A4C8CB1F5240CB1F5230CBFF5210F400C9ED54F80F01D30721C0009F6C519320D74A96D307D402FB00E830E021C001E30021C002E30001C0039130E30D03A4C8CB1F12CB1FCBFF1011121302E6D001D0D3032171B0925F04E022D749C120925F04E002D31F218210706C7567BD22821064737472BDB0925F05E003FA403020FA4401C8CA07CBFFC9D0ED44D0810140D721F404305C810108F40A6FA131B3925F07E005D33FC8258210706C7567BA923830E30D03821064737472BA925F06E30D06070201200809007801FA00F40430F8276F2230500AA121BEF2E0508210706C7567831EB17080185004CB0526CF1658FA0219F400CB6917CB1F5260CB3F20C98040FB0006008A5004810108F45930ED44D0810140D720C801CF16F400C9ED540172B08E23821064737472831EB17080185005CB055003CF1623FA0213CB6ACB1FCB3FC98040FB00925F03E20201200A0B0059BD242B6F6A2684080A06B90FA0218470D4080847A4937D29910CE6903E9FF9837812801B7810148987159F31840201580C0D0011B8C97ED44D0D70B1F8003DB29DFB513420405035C87D010C00B23281F2FFF274006040423D029BE84C600201200E0F0019ADCE76A26840206B90EB85FFC00019AF1DF6A26840106B90EB858FC0006ED207FA00D4D422F90005C8CA0715CBFFC9D077748018C8CB05CB0222CF165005FA0214CB6B12CCCCC973FB00C84014810108F451F2A7020070810108D718FA00D33FC8542047810108F451F2A782106E6F746570748018C8CB05CB025006CF165004FA0214CB6A12CB1FCB3FC973FB0002006C810108D718FA00D33F305224810108F459F2A782106473747270748018C8CB05CB025005CF165003FA0213CB6ACB1F12CB3FC973FB00000AF400C9ED54696225E5';

export class TonCrypto extends Signer {
	async getAccount (mnemonic: string): Promise<Keys> {
		const entropy = hmac(sha512, mnemonic, '');
		const I = pbkdf2(sha512, entropy, MASTER_SECRET, { c: PBKDF_ITERATIONS, dkLen: 64 * 8 });
		const keyPair = nacl.sign.keyPair.fromSeed(I.slice(0, 32));
		
		return {
			public: Buffer.from(keyPair.publicKey),
			private: Buffer.from(keyPair.secretKey)
		};
	}

	async getAddress (publicKey: Buffer, opts: { workchain: number, walletId?: number } = { workchain: 0 }): Promise<string> {
		if (opts.workchain === undefined) {
			throw new Error('Incorrect workchain of ton');
		}
		let walletId;
		if (opts.walletId != null) {
			walletId = opts.walletId;
		} else {
			walletId = DefaultSubwallet + opts.workchain;
		}
		const code = Cell.fromBoc(Buffer.from(_V4R2CodeHex, 'hex'))[0];
		const data = beginCell()
			.storeUint(0, 32)
			.storeUint(walletId, 32)
			.storeBuffer(publicKey)
			.storeBit(0)
			.endCell();
		return contractAddress(opts.workchain, { code, data }).toString({ urlSafe: true, bounceable: false, testOnly: false });
	}

	sign (message: any, privateKey: Buffer) {
		const cell = Cell.fromBase64(message.body);
		const signature = this.signEd25519(cell.hash(), privateKey);
		message.signature = signature.toString('hex');
	}

	validateAddress (address: string): boolean {
		return Address.isFriendly(address);
	}
}
