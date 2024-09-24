import { Outlet } from 'react-router-dom';
import { Loading } from '@/pages/loading';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useErrorBoundary } from 'react-error-boundary';
import { useNFTTransfer } from '@/providers/nft-transfer';
import { isObjectEmpty } from '@/utils/isObjectEmpty';
import { AxiosError } from 'axios';

type Params = {
	id: string;
};

export const Wrapper = () => {
	const params = useParams<Params>();
	const nftTransfer = useNFTTransfer();
	const { showBoundary } = useErrorBoundary();

	const [ isLoading, setIsLoading ] = useState<boolean>(true);

	const fetchNFT = async () => {
		if (!params.id) return;

		try {
			const item = await nftTransfer.fetchNftById(params.id);

			// console.log(item);
			if (isObjectEmpty(item)) {
				return showBoundary({ status: 404 });
			}
		} catch (error) {
			const e = error as AxiosError;

			console.error(error);
			showBoundary({ status: e.response?.status });
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchNFT();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (isLoading) {
		return <Loading />;
	}
	return <Outlet />;
};
