import { useTransfer } from '@/providers/transfer';
import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useErrorBoundary } from 'react-error-boundary';
import { notify } from '@/utils/notify';

export const Wrapper = ({ children }: any) => {
	const { showBoundary } = useErrorBoundary();
	const transfer = useTransfer();
	const params: any = useParams<{ network: string }>();

	useEffect(() => {
		transfer.loadWallet(params.network)
			.catch((error) =>{
				if (error?.status === 404) {
					notify({ message: error?.response?.data?.error, type: 'error' });
				} else {
					showBoundary(error);
				}
			});
	}, []);

	return <Outlet/>;
};
