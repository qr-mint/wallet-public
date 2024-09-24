import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { useAccountStore, ACCOUNT_STATE } from '../store/useAccountStore';
import { Home } from '@/pages/home';
import { Checker } from '@/pages/checker';
import { Exploler } from '@/pages/exploler';
import { DetailedToken } from '@/pages/detailed-token';
import { SelectDeposit } from '@/pages/select-deposit';
import { NFTRouter } from '@/pages/nft/router';
import { TransferRouter } from '@/pages/transfer';
import { PaymentsRouter } from '@/pages/payments';
import { ReceiverRouter } from '@/pages/receiver';
import { SettingsRouter } from '@/pages/settings/router';
import { Error404 } from '@/pages/errors/404';
import { AboutMnemonic } from '@/pages/about-mnemonic';
import { SwapRouter } from '@/pages/swap/router';
import { SwapRoutes } from '@/constants/routes.ts';
import { Recommendations } from '@/pages/recommendations';

export const AccountRoutes = () => {
	const navigate = useNavigate();
	const account = useAccountStore();

	useEffect(() => {
		if (account.state === ACCOUNT_STATE.UNCONNECTED) {
			navigate('/add-addresses');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (account.state === ACCOUNT_STATE.CONNECTED) {
		return (
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/recommendations' element={<Recommendations />} />
				<Route path='/about-mnemonic' element={<AboutMnemonic />} />
				<Route path='/coins/:token' element={<DetailedToken />} />
				<Route path='/exploler' element={<Exploler />} />
				<Route path='/select-deposit' element={<SelectDeposit />} />
				<Route path='/nft/*' element={<NFTRouter />} />
				<Route path='/transfer/*' element={<TransferRouter />} />
				<Route path='/receiver/*' element={<ReceiverRouter />} />
				<Route path='/settings/*' element={<SettingsRouter />} />
				<Route path='/payments/*' element={<PaymentsRouter />} />
				<Route path={SwapRoutes.SWAP('*')} element={<SwapRouter />} />
				<Route key="404" path='/*' element={<Error404 />} />
			</Routes>
		);
	} else if (account.state === ACCOUNT_STATE.LOCKED) {
		return (
			<Checker />
		);
	}
	return (
		<Routes>
			<Route key="404" path='/*' element={<Error404 />} />
		</Routes>
	);
};
