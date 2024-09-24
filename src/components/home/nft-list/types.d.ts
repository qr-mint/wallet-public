import type { HTMLAttributes } from 'react';
import type { NFTItem } from '@/api/nft/types';

interface NFTProps extends HTMLAttributes<HTMLDivElement> {
	nft: NFTItem;
}

interface NFTListProps {
	nftList: NFTItem[];
	className?: string;
	fetching?: boolean;
	loading?: boolean;
	noMore?: boolean;
}

interface NFTSkeletonProps {
	count?: number;
}
