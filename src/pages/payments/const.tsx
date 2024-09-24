import SimpleSwap from '@/assets/icons/simpleswap.svg?react';
import FinchPay from '@/assets/icons/finchpat.svg?react';
import LetExachange from '@/assets/images/letsexachange.png';
import Uniramp from '@/assets/images/uniramp.svg';

export const methods = [
	{
		name: 'Simple Swap',
		key: 'simple_swap',
		icon: <SimpleSwap />,
	},
	{
		name: 'uniramp',
		key: 'uniramp',
		image: Uniramp,
		widget: 'https://widget.uniramp.com/?api_key=pk_prod_jfrMIlHW2rv5bvS4LQ97fLBaCIdXBBJ7'
	},
	{
		name: 'Finch Pay',
		key: 'finch_pay',
		icon: <FinchPay />,
	},
	{
		name: 'Lets Exachange',
		key: 'lets_exachange',
		image: LetExachange,
		widget: 'https://letsexchange.io/v2/widget?affiliate_id=ZVDlskW6lMED7zdU&is_iframe=true'
	}
];