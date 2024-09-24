import { useState } from 'react';
import { NftApi } from '@/api';
import { useErrorBoundary } from 'react-error-boundary';
import type { NFTItem } from '@/types';

export const useFetchNfts = () => {
	const { showBoundary } = useErrorBoundary();

	const [ data, setData ] = useState<NFTItem[]>([]);
	const [ isLoading, setIsLoading ] = useState(false);

	const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	const fetchNfts = async () => {
		setIsLoading(true);

		await delay(300);

		try {
			const items = await NftApi.getList({ limit: 30, offset: 0 });
			setData(items);
		} catch (e) {
			console.error(e);
			showBoundary(e);
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, fetchNfts, data };
};
