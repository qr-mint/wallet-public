import type { ReactNode } from 'react';
import { TokenInfo } from '@/store/token/types.ts';
import { Token } from '@/store/addresses/types';

export interface WalletProps {
	children: ReactNode;

	loading?: boolean;
	className?: string;
	isDetailed?: boolean;
	wallet?: TokenInfo & Token;
}
