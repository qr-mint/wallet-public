import TonImage from '@/assets/images/tokens/toncoin.png';
import UsdtImage from '@/assets/images/tokens/tether.png';
import TronImage from '@/assets/images/tokens/tron.png';

export const getAssetIcon = (networkName: string) => {
	if (networkName === 'ton') {
		return TonImage;
	} else if (networkName === 'usdt') {
		return UsdtImage;
	} else if (networkName === 'tron') {
		return TronImage;
	}
};
