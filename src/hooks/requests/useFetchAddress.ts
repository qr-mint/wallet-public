import { useState } from 'react';
import { useAddressStore } from '@/store/addresses';
import { useErrorBoundary } from 'react-error-boundary';

export const useFetchAddress = () => {
	const { showBoundary } = useErrorBoundary();
	const { loadAddresses, ...address } = useAddressStore();

	const [ state, setState ] = useState({
		loading: false,
		fetching: false,
	});

	const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	const fetchAddresses = async () => {
		if (address.fiatAmount) {
			setState((prev) => ({ ...prev, fetching: true }));
		} else {
			setState((prev) => ({ ...prev, loading: true }));
		}

		await delay(300);

		try {
			await loadAddresses(showBoundary);
		} finally {
			setState({ fetching: false, loading: false });
		}
	};

	return { state, fetchAddresses, data: address };
};
