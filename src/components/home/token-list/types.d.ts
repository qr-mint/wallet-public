import { Token } from '@/store/addresses/types';
import type { HTMLAttributes } from 'react';

export interface TokenListProps {
	tokenList: Token[];

	loading?: boolean;
	className?: string;
}

export interface TokenProps extends HTMLAttributes<HTMLDivElement> {
	token: Token;
}

export interface TokenSkeletonProps {
	count?: number;
}
