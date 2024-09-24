import { TonCrypto } from './ton';
import { TronCrypto } from './trc20';

enum Chains {
	trc20 = 'trc20',
	ton = 'ton',
}

export default {
	trc20: new TronCrypto(Chains.trc20),
	ton: new TonCrypto(Chains.ton),
};
