import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import nacl from 'tweetnacl';

export function byte2hexStr (byte: any) {
	if (typeof byte !== 'number')
		throw new Error('Input must be a number');

	if (byte < 0 || byte > 255)
		throw new Error('Input must be a byte');

	const hexByteMap = '0123456789ABCDEF';

	let str = '';
	str += hexByteMap.charAt(byte >> 4);
	str += hexByteMap.charAt(byte & 0x0f);

	return str;
}

export class Signer {
	public chain: string;
	constructor (chain: string) {
		this.chain = chain;
	}
	signSecp256k1 (hashBytes: any, priKeyBytes: any) {
		const signature = secp256k1.sign(hashBytes, priKeyBytes);

		const r = signature.r.toString(16).padStart(64, '0');
		const s = signature.s.toString(16).padStart(64, '0');
		const v = signature.recovery + 27;

		return this.signatureToHex({ r, s, v });
	}
	
	signatureToHex ({ r, s, v }: any) {
		return [ r, s, byte2hexStr(v) ].join('');
	}

	signEd25519 (data: Buffer, secretKey: Buffer) {
		return Buffer.from(nacl.sign.detached(new Uint8Array(data), new Uint8Array(secretKey)));
	}

	signVerify (data: Buffer, signature: Buffer, publicKey: Buffer) {
		return nacl.sign.detached.verify(new Uint8Array(data), new Uint8Array(signature), new Uint8Array(publicKey));
	}
}

// ('84d366f6e8e2bbb77716266ddda85dce0e43afe3af8a0d67b5e157cbfc773a2666171331405e8891414088e47ba369001556fda83ab2ce5cd49c54ad6c25238b28');
// ('84d366f6e8e2bbb77716266ddda85dce0e43afe3af8a0d67b5e157cbfc773a2666171331405e8891414088e47ba369001556fda83ab2ce5cd49c54ad6c25238b01');
